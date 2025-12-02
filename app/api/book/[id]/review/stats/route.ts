import dbConnectionPool from "@/app/_lib/db/db";
import { RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

interface ReviewStatsRowDataPacket extends RowDataPacket {
  average_rating: number | null;
  review_count: number;
}

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
        AVG(rating) as average_rating, 
        COUNT(*) as review_count 
      FROM reviews 
      WHERE book_id = ?
    `;
    const [results] = await dbConnection.execute<ReviewStatsRowDataPacket[]>(
      sql,
      [bookId]
    );

    if (results.length === 0 || results[0].review_count === 0) {
      return NextResponse.json({
        average_rating: 0,
        review_count: 0,
      });
    }

    return NextResponse.json({
      average_rating: Number(results[0].average_rating),
      review_count: results[0].review_count,
    });
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
