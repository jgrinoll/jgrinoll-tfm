import { getSessionInfo } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import { ReadingProgress } from "@/app/_lib/models/ReadingProgress";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

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
    const [results] = await dbConnection.execute<ReadingProgressRowDataPacket[]>(
      sql,
      [userId, bookId]
    );

    if (results.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Reading progress not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(results[0] as ReadingProgress);
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
      "SELECT id FROM reading_progress WHERE user_id = ? AND book_id = ?",
      [userId, bookId]
    );
    if (existing.length > 0) {
      const rowId = existing[0].id;
      // Update the progress
      // TODO - Crear mètodes auxiliars per les queries més comuns per reduir el codi duplicat.
      const sql =
        "UPDATE reading_progress SET pages_read = ?, percentage = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
      const values = [pageCount, percentage ?? null, rowId];
      const [updateResult] = await dbConnection.execute<ResultSetHeader>(
        sql,
        values
      );
      console.log("Update result: ", updateResult);
      return new Response();
    } else {
      // Insert a new progress update
      const sql =
        "INSERT INTO reading_progress (user_id, book_id, pages_read, percentage) VALUES (?,?,?,?)";
      const values = [userId, bookId, pageCount, percentage ?? null];
      const [insertResult] = await dbConnection.execute<ResultSetHeader>(
        sql,
        values
      );
      console.log("Insert result: ", insertResult);
      return NextResponse.json(
        { ok: true, id: insertResult.insertId },
        { status: 201 }
      );
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
