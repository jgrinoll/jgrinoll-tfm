import dbConnectionPool from "@/app/_lib/db/db";
import { ReviewWithUser } from "@/app/_lib/models/ReviewWithUser";
import { RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

interface ReviewWithUserRowDataPacket extends RowDataPacket, ReviewWithUser {}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  let dbConnection;
  try {
    const { id: bookId } = await context.params;

    dbConnection = await dbConnectionPool.getConnection();

    const sql = `
      SELECT 
        r.id, 
        r.user_id, 
        r.book_id, 
        r.rating, 
        r.review_text, 
        r.created_at,
        u.username,
        u.avatar_url
      FROM reviews r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.book_id = ?
      ORDER BY r.created_at DESC
      LIMIT 3
    `;
    const [results] = await dbConnection.execute<
      ReviewWithUserRowDataPacket[]
    >(sql, [bookId]);

    return NextResponse.json(results as ReviewWithUser[]);
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
