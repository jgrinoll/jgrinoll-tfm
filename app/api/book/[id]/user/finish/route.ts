import { refreshSessionIfValid } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";
import { updateUserPagesAndLevel } from "@/app/_actions/user_actions";
import { checkAndAwardAchievements, checkAndUpdateChallenges } from "@/app/_actions/gamification_actions";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  let dbConnection;
  try {
    // Authorize and get user id
    const sessionInfo = await refreshSessionIfValid();
    if (!sessionInfo) return NextResponse.json({ ok: false }, { status: 401 });
    const { id: userId } = sessionInfo;

    // Get path parameter: book id
    const { id: bookId } = await context.params;

    // Check if a row already exists
    dbConnection = await dbConnectionPool.getConnection();
    await dbConnection.beginTransaction();

    try {
      const [bookResults] = await dbConnection.execute<RowDataPacket[]>(
        "SELECT page_count FROM books WHERE id = ?",
        [bookId]
      );

      const bookPageCount = bookResults.length > 0 ? (bookResults[0].page_count as number) || 0 : 0;

      const [progressResults] = await dbConnection.execute<RowDataPacket[]>(
        "SELECT pages_read FROM reading_progress WHERE user_id = ? AND book_id = ?",
        [userId, bookId]
      );

      const currentPagesRead = progressResults.length > 0 ? (progressResults[0].pages_read as number) || 0 : 0;

      const remainingPages = Math.max(0, bookPageCount - currentPagesRead);
      let levelUpData = null;

      if (remainingPages > 0) {
        const levelResult = await updateUserPagesAndLevel(
          userId,
          remainingPages,
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

      let [existing] = await dbConnection.execute<RowDataPacket[]>(
        "SELECT id FROM user_books WHERE user_id = ? AND book_id = ?",
        [userId, bookId]
      );
      if (existing.length > 0) {
        const rowId = existing[0].id;
        await updateUserBooks(rowId, dbConnection);
      } else {
        await insertUserBooks(userId, bookId, dbConnection);
      }

      [existing] = await dbConnection.execute<RowDataPacket[]>(
        "SELECT id FROM reading_progress WHERE user_id = ? AND book_id = ?",
        [userId, bookId]
      );
      if (existing.length > 0) {
        const rowId = existing[0].id;
        await deleteReadingProgress(rowId, dbConnection);
      }


      const completedAchievements = await checkAndAwardAchievements(
        userId,
        dbConnection
      );

      const completedChallenges = await checkAndUpdateChallenges(
        userId,
        bookId,
        remainingPages,
        true,
        dbConnection
      );

      await dbConnection.commit();

      return NextResponse.json({
        ok: true,
        levelUp: levelUpData,
        gamification: {
          completedAchievements,
          completedChallenges,
        },
      });
    } catch (err) {
      dbConnection.rollback();
    }
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

async function insertUserBooks(
  userId: number,
  bookId: string,
  dbConnection: Connection
) {
  const sql =
    "INSERT INTO user_books (user_id, book_id, status) VALUES (?,?,?)";
  const values = [userId, bookId, "LLEGIT"];
  const [insertResult] = await dbConnection.execute<ResultSetHeader>(
    sql,
    values
  );

  console.log("Insert result: ", insertResult);
}

async function updateUserBooks(
  rowId: RowDataPacket[],
  dbConnection: Connection
) {
  // Mark the book as LLEGIT
  const sql =
    "UPDATE user_books SET status = 'LLEGIT', updated_at = CURRENT_TIMESTAMP WHERE id = ?";
  const values = [rowId];
  const [updateResult] = await dbConnection.execute<ResultSetHeader>(
    sql,
    values
  );
  console.log("Update result: ", updateResult);
}

async function deleteReadingProgress(
  rowId: RowDataPacket[],
  dbConnection: Connection
) {
  // Mark the book as LLEGIT
  const sql = "DELETE FROM reading_progress WHERE id = ?";
  const values = [rowId];
  const [updateResult] = await dbConnection.execute<ResultSetHeader>(
    sql,
    values
  );
  console.log("Delete result: ", updateResult);
}
