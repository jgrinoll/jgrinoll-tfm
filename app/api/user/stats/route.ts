import { getSessionInfo } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2/promise";
import "server-only";

interface BookStat extends RowDataPacket {
  book_id: string;
  title: string;
  authors: string;
  thumbnail: string;
  page_count: number;
  avg_rating: number;
}

interface AuthorStat extends RowDataPacket {
  authors: string;
  book_count: number;
  book_id: string;
  title: string;
  thumbnail: string;
}

interface UserStats extends RowDataPacket {
  total_books_read: number;
  total_pages_read: number;
  avg_rating: number;
}

export async function GET() {
  let dbConnection;
  try {
    const sessionInfo = await getSessionInfo();
    if (!sessionInfo) return NextResponse.json({ ok: false }, { status: 401 });
    const { id: userId } = sessionInfo;

    dbConnection = await dbConnectionPool.getConnection();

    const [highestRatedResults] = await dbConnection.execute<BookStat[]>(
      `SELECT b.id as book_id, b.title, b.thumbnail, AVG(r.rating) as avg_rating
       FROM user_books ub
       JOIN books b ON ub.book_id = b.id
       LEFT JOIN reviews r ON b.id = r.book_id
       WHERE ub.user_id = ? AND ub.status = 'LLEGIT'
       GROUP BY b.id
       ORDER BY avg_rating DESC
       LIMIT 1`,
      [userId]
    );

    const [longestBookResults] = await dbConnection.execute<BookStat[]>(
      `SELECT b.id as book_id, b.title, b.thumbnail, b.page_count
       FROM user_books ub
       JOIN books b ON ub.book_id = b.id
       WHERE ub.user_id = ? AND ub.status = 'LLEGIT' AND b.page_count IS NOT NULL
       ORDER BY b.page_count DESC
       LIMIT 1`,
      [userId]
    );

    const [mostReadAuthorResults] = await dbConnection.execute<AuthorStat[]>(
      `SELECT b.authors, COUNT(*) as book_count, MAX(b.thumbnail) as thumbnail
       FROM user_books ub
       JOIN books b ON ub.book_id = b.id
       WHERE ub.user_id = ? AND ub.status = 'LLEGIT'
       GROUP BY b.authors
       ORDER BY book_count DESC
       LIMIT 1`,
      [userId]
    );

    const [userStatsResults] = await dbConnection.execute<UserStats[]>(
      `SELECT 
        COUNT(DISTINCT CASE WHEN ub.status = 'LLEGIT' THEN ub.book_id END) as total_books_read,
        COALESCE(
          SUM(CASE 
            WHEN ub.status = 'LLEGIT' THEN b.page_count
            WHEN ub.status = 'LLEGINT' THEN rp.pages_read
            ELSE 0
          END), 0
        ) as total_pages_read,
        COALESCE(AVG(r.rating), 0) as avg_rating
       FROM user_books ub
       JOIN books b ON ub.book_id = b.id
       LEFT JOIN reading_progress rp ON ub.book_id = rp.book_id AND rp.user_id = ?
       LEFT JOIN reviews r ON ub.book_id = r.book_id AND r.user_id = ?
       WHERE ub.user_id = ? AND ub.status IN ('LLEGIT', 'LLEGINT')`,
      [userId, userId, userId]
    );

    const stats = {
      highestRatedBook: highestRatedResults[0] || null,
      longestBook: longestBookResults[0] || null,
      mostReadAuthor: mostReadAuthorResults[0] || null,
      totalBooksRead: userStatsResults[0]?.total_books_read || 0,
      totalPagesRead: userStatsResults[0]?.total_pages_read || 0,
      avgRating: userStatsResults[0]?.avg_rating || 0,
    };

    return NextResponse.json(stats);
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
