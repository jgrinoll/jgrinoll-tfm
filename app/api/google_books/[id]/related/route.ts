import { GoogleBooksSearchResponse } from "@/app/_lib/models/GoogleBook";
import { getBookDetails, getRelatedBooks } from "@/app/books/_utils/api_utils";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookId } = await params;

  if (!bookId) {
    return NextResponse.json(
      { ok: false, error: "Cal especificar l'id del llibre" },
      { status: 400 }
    );
  }

  try {
    const book = await getBookDetails(bookId);
    const relatedBooks = await getRelatedBooks(book);

    // Return simulating a google books search
    return NextResponse.json({
      kind: "books#volumes",
      totalItems: relatedBooks.length,
      items: relatedBooks
    } as GoogleBooksSearchResponse);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Error fetching related books" },
      { status: 500 }
    );
  }
}
