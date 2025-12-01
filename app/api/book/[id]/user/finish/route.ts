import { getSessionInfo } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

interface FinishBookRequestBody {
  review?: unknown;
}
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { review }: FinishBookRequestBody = await req.json();

    // Authorize and get user id
    const sessionInfo = await getSessionInfo();
    if (!sessionInfo) return NextResponse.json({ ok: false }, { status: 401 });
    const { id: userId } = sessionInfo;

    // Get path parameter: book id
    const { id: bookId } = await context.params;

    // Check if a row already exists
    // TODO - Use the pool.getConnection() everywhere...
    const dbConnection = await dbConnectionPool.getConnection();
    await dbConnection.beginTransaction();

    try {
      // Update book status in user_books
      let [existing] = await dbConnection.execute<RowDataPacket[]>(
        "SELECT id FROM user_books WHERE user_id = ? AND book_id = ?",
        [userId, bookId]
      );
      if (existing.length > 0) {
        const rowId = existing[0].id;
        await updateUserBooks(rowId, dbConnection);
      } else {
        // Insert a new progress update
        await insertUserBooks(userId, bookId, dbConnection);
      }

      // Delete reading_progress if it exists
      [existing] = await dbConnection.execute<RowDataPacket[]>(
        "SELECT id FROM reading_progress WHERE user_id = ? AND book_id = ?",
        [userId, bookId]
      );
      if (existing.length > 0) {
        const rowId = existing[0].id;
        await deleteReadingProgress(rowId, dbConnection);
      }

      // TODO - Insert review
      if (review) {
        console.log("Reviews not implemented");
      }

      dbConnection.commit();

      return new Response();
    } catch (err) {
      dbConnection.rollback();
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
