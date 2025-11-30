import { GetDBSettings } from "@/app/_lib/db/DBSettings";
import {
  Book,
  GoogleBooksSearchResponse,
  ImageLinks,
} from "@/app/_lib/models/Book";
import { ResultSetHeader } from "mysql2";
import { Connection, createConnection, RowDataPacket } from "mysql2/promise";

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

export const getBookDetails = async (bookId: string): Promise<Book> => {
  const queryParams = new URLSearchParams({
    key: process.env.BOOKS_API_KEY || "",
  });
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}?${queryParams.toString()}`,
    {
      method: "GET",
    }
  );

  const book = (await res.json()) as Book;
  insertBook(book);

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

const cacheBooksInDatabase = async (books: Book[]) => {
  const bookIds = books.map((book) => book.id);
  const sql = "SELECT id FROM books WHERE id NOT IN (?)";

  const dbConnection = await createConnection(GetDBSettings());
  const [existingRows] = await dbConnection.execute<RowDataPacket[]>(sql, [
    bookIds,
  ]);

  const booksToInsert: Book[] = [];
  books.forEach((book) => {
    if (existingRows.findIndex((row) => row.id === book.id) === -1)
      booksToInsert.push(book);
  });

  for (const book of booksToInsert) {
    await insertBook(book);
  }

  await dbConnection.end();
};

const insertBook = async (book: Book, connection?: Connection) => {
  const dbConnection = connection ?? (await createConnection(GetDBSettings()));

  const sql =
    "INSERT INTO books (id, title, authors, thumbnail, page_count, categories, description) VALUES (?,?,?,?,?,?,?)";

  const thumbnail = await getLargestAvailableThumbnail(
    book.volumeInfo.imageLinks
  );

  const values = [
    book.id,
    book.volumeInfo.title,
    book.volumeInfo.authors?.join(", "),
    thumbnail,
    book.volumeInfo.pageCount,
    book.volumeInfo.categories?.join(";"),
    book.volumeInfo.description,
  ];

  const [queryResult] = await dbConnection.execute<ResultSetHeader>(
    sql,
    values
  );

  console.log("Book added to cache: ", queryResult);
};
