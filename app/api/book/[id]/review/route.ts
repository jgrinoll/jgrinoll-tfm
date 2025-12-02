import { getSessionInfo } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import { Review } from "@/app/_lib/models/Review";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

interface ReviewRowDataPacket extends RowDataPacket, Review {}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  let dbConnection;
  try {
    const sessionInfo = await getSessionInfo();
    if (!sessionInfo) return NextResponse.json({ ok: false }, { status: 401 });

    const { id: bookId } = await context.params;
    const userId = sessionInfo.id;

    dbConnection = await dbConnectionPool.getConnection();

    const sql = "SELECT * FROM reviews WHERE user_id = ? AND book_id = ?";
    const [results] = await dbConnection.execute<ReviewRowDataPacket[]>(sql, [
      userId,
      bookId,
    ]);

    if (results.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(results[0] as Review);
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

interface CreateReviewRequestBody {
  rating: number;
  review_text: string;
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  let dbConnection;
  try {
    const { rating, review_text }: CreateReviewRequestBody = await req.json();

    if (!rating || !review_text) {
      return NextResponse.json(
        { ok: false, error: "Falten camps obligatoris!" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { ok: false, error: "La puntuació ha de ser entre 1 i 5!" },
        { status: 400 }
      );
    }

    const sessionInfo = await getSessionInfo();
    if (!sessionInfo) return NextResponse.json({ ok: false }, { status: 401 });
    const { id: userId } = sessionInfo;

    const { id: bookId } = await context.params;

    dbConnection = await dbConnectionPool.getConnection();

    const [existing] = await dbConnection.execute<RowDataPacket[]>(
      "SELECT id FROM reviews WHERE user_id = ? AND book_id = ?",
      [userId, bookId]
    );

    if (existing.length > 0) {
      const rowId = existing[0].id;
      const sql = "UPDATE reviews SET rating = ?, review_text = ? WHERE id = ?";
      const values = [rating, review_text, rowId];
      await dbConnection.execute<ResultSetHeader>(sql, values);
      return NextResponse.json({ ok: true, id: rowId });
    } else {
      const sql =
        "INSERT INTO reviews (user_id, book_id, rating, review_text) VALUES (?,?,?,?)";
      const values = [userId, bookId, rating, review_text];
      const [insertResult] = await dbConnection.execute<ResultSetHeader>(
        sql,
        values
      );
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
