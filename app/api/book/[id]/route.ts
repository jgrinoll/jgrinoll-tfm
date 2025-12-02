import dbConnectionPool from "@/app/_lib/db/db";
import Book from "@/app/_lib/models/Book";
import { RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

interface BookRowDataPacket extends RowDataPacket, Book {}
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookId } = await params;
  const book = await getBook(bookId);

  if (!book) {
    return NextResponse.json(
      { ok: false, error: "Book not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(book);
}

// TODO - Move this to a data access layer
export async function getBook(bookId: string): Promise<Book | null> {
  let dbConnection;
  try {
    dbConnection = await dbConnectionPool.getConnection();

    const sql = "SELECT * FROM books WHERE id = ?";
    const [results] = await dbConnection.execute<BookRowDataPacket[]>(sql, [
      bookId,
    ]);

    if (results.length === 0) return null;
    return results[0] as Book;
  } finally {
    if (dbConnection) dbConnection.release();
  }
}
