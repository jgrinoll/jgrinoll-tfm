import { getSessionInfo } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import List from "@/app/_lib/models/ListsEnum";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";
import "server-only";

interface AddToListProps {
  list: List;
  bookId: string;
}
export async function POST(req: Request) {
  let dbConnection;
  try {
    const sessioninfo = await getSessionInfo();
    if (!sessioninfo) return NextResponse.json({ ok: false }, { status: 401 });

    const userId = sessioninfo.id;
    const { list, bookId }: AddToListProps = await req.json();

    if (!list || !bookId) {
      return NextResponse.json(
        { ok: false, error: "Error! Falta la llista o el id del llibre!" },
        { status: 400 }
      );
    }

    dbConnection = await dbConnectionPool.getConnection();

    // Duplicate user book check
    const [existing] = await dbConnection.execute<RowDataPacket[]>(
      "SELECT id FROM user_books WHERE book_id = ? AND user_id = ?",
      [bookId, userId]
    );
    if (existing.length > 0) {
      // Already exists, we update the list it's in
      const sql = "UPDATE user_books SET status = ? WHERE id = ?";
      await dbConnection.execute<RowDataPacket[]>(sql, [list, existing[0].id]);
      return new Response(); // 200
    }

    // Insert user
    // Hash the password using bcrypt
    const [result] = await dbConnection.execute<ResultSetHeader>(
      "INSERT INTO user_books (user_id, book_id, status) VALUES (?,?,?)",
      [userId, bookId, list]
    );

    return NextResponse.json(
      { ok: true, id: result.insertId },
      { status: 201 }
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
