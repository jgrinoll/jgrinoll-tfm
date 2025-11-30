import {
  Book,
  GoogleBooksSearchResponse,
  ImageLinks,
} from "@/app/_lib/models/Book";

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

  return (await res.json()) as GoogleBooksSearchResponse;
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

  return (await res.json()) as Book;
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
