import dbConnectionPool from "@/app/_lib/db/db";
import { GoogleBook } from "@/app/_lib/models/GoogleBook";
import { RowDataPacket } from "mysql2/promise";

export interface RatedBookResult extends RowDataPacket {
  book_id: string;
  avg_rating: number;
}

export const getRatedBookIds = async (
  minRating: number,
  limit: number = 10,
  offset: number = 0
): Promise<RatedBookResult[]> => {
  if (minRating < 1 || minRating > 5) {
    throw new Error("minRating must be between 1 and 5");
  }

  let dbConnection;
  try {
    dbConnection = await dbConnectionPool.getConnection();

    const sql = `
      SELECT book_id, AVG(rating) as avg_rating 
      FROM reviews 
      GROUP BY book_id 
      HAVING AVG(rating) >= ? 
      ORDER BY AVG(rating) DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const [results] = await dbConnection.execute<RatedBookResult[]>(sql, [
      minRating,
    ]);

    return results;
  } catch (error) {
    console.error("Error fetching rated book IDs:", error);
    throw error;
  } finally {
    if (dbConnection) {
      dbConnection.release();
    }
  }
};

export const filterBooksByText = (
  books: GoogleBook[],
  query: string
): GoogleBook[] => {
  if (!query || query.trim() === "") {
    return books;
  }

  const searchTerm = query.toLowerCase().trim();

  return books.filter((book) => {
    const title = book.volumeInfo.title?.toLowerCase() || "";
    const authors = book.volumeInfo.authors?.join(" ").toLowerCase() || "";
    const description = book.volumeInfo.description?.toLowerCase() || "";
    const categories = book.volumeInfo.categories?.join(" ").toLowerCase() || "";

    return (
      title.includes(searchTerm) ||
      authors.includes(searchTerm) ||
      description.includes(searchTerm) ||
      categories.includes(searchTerm)
    );
  });
};
