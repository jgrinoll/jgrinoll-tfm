import dbConnectionPool from "@/app/_lib/db/db";
import {
  GoogleBook,
  GoogleBooksSearchResponse,
  ImageLinks,
} from "@/app/_lib/models/GoogleBook";
import { ResultSetHeader } from "mysql2";
import { Connection, RowDataPacket } from "mysql2/promise";

export const searchBooks = async (
  query: string
): Promise<GoogleBooksSearchResponse> => {
  const queryParams = new URLSearchParams({
    q: query,
    key: process.env.BOOKS_API_KEY || "",
  });
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?${queryParams.toString()}`,
    {
      method: "GET",
    }
  );

  const bookSearchResponse = (await res.json()) as GoogleBooksSearchResponse;

  cacheBooksInDatabase(bookSearchResponse.items); // We don't need to await for this, it can be done asynchronously

  return bookSearchResponse;
};

export const getBookDetails = async (bookId: string): Promise<GoogleBook> => {
  const queryParams = new URLSearchParams({
    key: process.env.BOOKS_API_KEY || "",
  });
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}?${queryParams.toString()}`,
    {
      method: "GET",
    }
  );

  const book = (await res.json()) as GoogleBook;
  cacheBooksInDatabase([book]);

  return book;
};

export const getLargestAvailableThumbnail = async (
  imageLinks: ImageLinks
): Promise<string> => {
  const queryParams = new URLSearchParams({
    key: process.env.BOOKS_API_KEY || "",
  }).toString();
  // Get any of the available sizes, prioritizing larger ones
  // He vist que al llistar només hi ha smallThumbnail i thumbnail
  const sizes: string[] = Object.values(imageLinks);

  let biggestThumbnailSize = 0;
  let biggestThumbnailUrl = "";
  for (const url of sizes) {
    if (!url) continue;

    // If image is not available, the API returns an URL to an "not available" image.
    // To know if it's a "not available" image or the cover, we'll check the size of the image
    const resp = await fetch(url + `?${queryParams}`, {
      method: "HEAD",
      headers: {
        origin: "localhost:3000",
      },
    });

    const contentLength = parseInt(resp.headers.get("Content-Length") ?? "0");
    if (contentLength > biggestThumbnailSize) {
      biggestThumbnailUrl = url;
      biggestThumbnailSize = contentLength;
    }
  }
  return biggestThumbnailUrl.replace("http", "https");
};

const cacheBooksInDatabase = async (books: GoogleBook[]) => {
  const bookIds = books.map((book) => book.id);
  const sql = "SELECT id FROM books WHERE id NOT IN (?)";

  const dbConnection = await dbConnectionPool.getConnection();
  try {
    const [existingRows] = await dbConnection.execute<RowDataPacket[]>(sql, [
      bookIds,
    ]);

    const booksToInsert: GoogleBook[] = [];
    books.forEach((book) => {
      if (existingRows.findIndex((row) => row.id === book.id) === -1)
        booksToInsert.push(book);
    });

    for (const book of booksToInsert) {
      await insertBook(book);
    }
  } finally {
    dbConnection.release();
  }
};

const insertBook = async (book: GoogleBook, connection?: Connection) => {
  const dbConnection = connection ?? (await dbConnectionPool.getConnection());

  const sql =
    "INSERT INTO books (id, title, authors, thumbnail, page_count, categories, description) VALUES (?,?,?,?,?,?,?)";

  const thumbnail = book.volumeInfo.imageLinks
    ? await getLargestAvailableThumbnail(book.volumeInfo.imageLinks)
    : null;

  const values = [
    book.id,
    book.volumeInfo.title,
    book.volumeInfo.authors?.join(", "),
    thumbnail,
    book.volumeInfo.pageCount,
    book.volumeInfo.categories?.join(";"),
    book.volumeInfo.description,
  ];

  await dbConnection.execute<ResultSetHeader>(sql, values);
};
