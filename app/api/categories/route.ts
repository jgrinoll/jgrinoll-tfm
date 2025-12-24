import { CATEGORIES } from "@/app/_lib/utils/category_utils";
import { Category } from "@/app/_lib/models/Category";
import { GoogleBooksSearchResponse } from "@/app/_lib/models/GoogleBook";
import { NextResponse } from "next/server";
import "server-only";

export async function getCategoriesWithThumbnails(): Promise<Category[]> {
  const categoriesWithThumbnails: Category[] = [];

  for (const category of CATEGORIES) {
    const queryParams = new URLSearchParams({
      q: `subject:"${category.value}"`,
      key: process.env.BOOKS_API_KEY || "",
      maxResults: "1",
    });

    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?${queryParams.toString()}`,
        {
          method: "GET",
        }
      );

      const response = (await res.json()) as GoogleBooksSearchResponse;

      if (response.items && response.items.length > 0) {
        const book = response.items[0];
        const thumbnail =
          book.volumeInfo.imageLinks?.thumbnail ||
          book.volumeInfo.imageLinks?.smallThumbnail;

        if (thumbnail) {
          categoriesWithThumbnails.push({
            ...category,
            thumbnail: thumbnail.replace("http:", "https:"),
          });
          continue;
        }
      }

      categoriesWithThumbnails.push(category);
    } catch (error) {
      console.error(
        `Error searching for a thumbnail for category ${category.label}: ${error}`
      );

      categoriesWithThumbnails.push(category);
    }
  }

  return categoriesWithThumbnails;
}

export async function GET() {
  const categories = await getCategoriesWithThumbnails();
  return NextResponse.json({ categories });
}
