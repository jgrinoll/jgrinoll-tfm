import { getSessionInfo } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import { UserBook } from "@/app/_lib/models/UserBook";
import { NextResponse } from "next/server";
import "server-only";

export async function GET(req: Request) {
  let dbConnection;
  try {
    // Get search parameters
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const status = searchParams.get("status");

    // Authorize and get user id
    const sessionInfo = await getSessionInfo();
    if (!sessionInfo) return NextResponse.json({ ok: false }, { status: 401 });
    const { id: userId } = sessionInfo;

    // Get the data from DB
    dbConnection = await dbConnectionPool.getConnection();

    let sql = "SELECT * FROM user_books WHERE user_id = ?";
    const values: (string | number)[] = [userId];
    if (status) {
      sql += " AND status = ?";
      values.push(status);
    }
    const [results] = await dbConnection.execute(sql, values);
    return NextResponse.json(results as UserBook[]);
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

export async function DELETE(req: Request) {
  // return an empty JSON response and delete the session cookie
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("session");
  return res;
}
