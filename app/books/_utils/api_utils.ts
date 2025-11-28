import { GoogleBooksSearchResponse } from "@/app/_lib/models/Book";

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

  console.log("Google books response: ", res);

  const json = (await res.json()) as GoogleBooksSearchResponse;
  console.log("Google books response body JSON: ", res);
  return json;
};
