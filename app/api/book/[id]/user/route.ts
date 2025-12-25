import { refreshSessionIfValid } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import { UserBook } from "@/app/_lib/models/UserBook";
import { RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

interface UserBookRowDataPacket extends RowDataPacket, UserBook {}
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  let dbConnection;
  try {
    const sessioninfo = await refreshSessionIfValid();
    if (!sessioninfo) return NextResponse.json({ ok: false }, { status: 401 });

    const { id: bookId } = await context.params;

    const userId = sessioninfo.id;
    dbConnection = await dbConnectionPool.getConnection();

    const sql = "SELECT * FROM user_books WHERE user_id = ? AND book_id = ?";
    const [results] = await dbConnection.execute<UserBookRowDataPacket[]>(sql, [
      userId,
      bookId,
    ]);

    if (results.length === 0) {
      return NextResponse.json(
        { ok: false, error: "User book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(results[0] as UserBook);
  } finally {
    if (dbConnection) dbConnection.release();
  }
}
