import { getSessionInfo } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import { ReadingProgress } from "@/app/_lib/models/ReadingProgress";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";
import { updateUserPagesAndLevel } from "@/app/_actions/user_actions";
import {
  checkAndAwardAchievements,
  checkAndUpdateChallenges,
} from "@/app/_actions/gamification_actions";

interface ReadingProgressRowDataPacket extends RowDataPacket, ReadingProgress {}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  let dbConnection;
  try {
    const sessioninfo = await getSessionInfo();
    if (!sessioninfo) return NextResponse.json({ ok: false }, { status: 401 });

    const { id: bookId } = await context.params;

    const userId = sessioninfo.id;
    dbConnection = await dbConnectionPool.getConnection();

    const sql =
      "SELECT * FROM reading_progress WHERE user_id = ? AND book_id = ?";
    const [results] = await dbConnection.execute<
      ReadingProgressRowDataPacket[]
    >(sql, [userId, bookId]);

    if (results.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Reading progress not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(results[0] as ReadingProgress);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (dbConnection) dbConnection.release();
  }
}

interface UpdateProgressRequestBody {
  pageCount: number;
  percentage?: number;
}
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  let dbConnection;
  try {
    const { pageCount, percentage }: UpdateProgressRequestBody =
      await req.json();

    // Validate body
    if (!pageCount) {
      return NextResponse.json(
        {
          ok: false,
          error: "Falta especificar el nombre de pàgines llegides!",
        },
        { status: 400 }
      );
    }

    // Authorize and get user id
    const sessionInfo = await getSessionInfo();
    if (!sessionInfo) return NextResponse.json({ ok: false }, { status: 401 });
    const { id: userId } = sessionInfo;

    // Get path parameter: book id
    const { id: bookId } = await context.params;

    // Check if a row already exists
    dbConnection = await dbConnectionPool.getConnection();

    const [existing] = await dbConnection.execute<RowDataPacket[]>(
      "SELECT id, pages_read FROM reading_progress WHERE user_id = ? AND book_id = ?",
      [userId, bookId]
    );

    let oldPagesRead = 0;

    if (existing.length > 0) {
      const rowId = existing[0].id;
      oldPagesRead = existing[0].pages_read || 0;

      const sql =
        "UPDATE reading_progress SET pages_read = ?, percentage = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
      const values = [pageCount, percentage ?? null, rowId];
      const [updateResult] = await dbConnection.execute<ResultSetHeader>(
        sql,
        values
      );
      console.log("Update result: ", updateResult);
    } else {
      const sql =
        "INSERT INTO reading_progress (user_id, book_id, pages_read, percentage) VALUES (?,?,?,?)";
      const values = [userId, bookId, pageCount, percentage ?? null];
      const [insertResult] = await dbConnection.execute<ResultSetHeader>(
        sql,
        values
      );
      console.log("Insert result: ", insertResult);
    }

    const pagesDifference = pageCount - oldPagesRead;
    let levelUpData = null;

    if (pagesDifference > 0) {
      const levelResult = await updateUserPagesAndLevel(
        userId,
        pagesDifference,
        dbConnection
      );

      if (levelResult?.leveledUp) {
        console.log(
          `User ${userId} leveled up from ${levelResult.oldLevel} to ${levelResult.newLevel}!`
        );
        levelUpData = {
          leveledUp: true,
          oldLevel: levelResult.oldLevel,
          newLevel: levelResult.newLevel,
        };
      }
    }

    const completedAchievements = await checkAndAwardAchievements(
      userId,
      dbConnection
    );

    const completedChallenges = await checkAndUpdateChallenges(
      userId,
      bookId,
      pagesDifference,
      false,
      dbConnection
    );

    return NextResponse.json(
      {
        ok: true,
        levelUp: levelUpData,
        gamification: {
          completedAchievements,
          completedChallenges,
        },
      },
      { status: existing.length > 0 ? 200 : 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (dbConnection) dbConnection.release();
  }
}
