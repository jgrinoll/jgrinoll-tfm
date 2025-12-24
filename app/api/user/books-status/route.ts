import { getSessionInfo } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import { RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";
import "server-only";

interface UserBookStatus extends RowDataPacket {
  book_id: string;
  status: string;
  id: number;
  user_id: number;
}

export async function POST(req: Request) {
  let dbConnection;
  try {
    const sessionInfo = await getSessionInfo();
    if (!sessionInfo) return NextResponse.json({ ok: false }, { status: 401 });

    const { bookIds }: { bookIds: string[] } = await req.json();

    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      return NextResponse.json(
        { ok: false, error: "bookIds array is required" },
        { status: 400 }
      );
    }

    dbConnection = await dbConnectionPool.getConnection();

    const placeholders = bookIds.map(() => "?").join(",");
    const [results] = await dbConnection.execute<UserBookStatus[]>(
      `SELECT id, book_id, status, user_id FROM user_books WHERE user_id = ? AND book_id IN (${placeholders})`,
      [sessionInfo.id, ...bookIds]
    );

    return NextResponse.json(results);
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
