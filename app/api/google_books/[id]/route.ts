import { GoogleBook } from "@/app/_lib/models/GoogleBook";
import { getBookDetails } from "@/app/books/_utils/api_utils";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookId } = await params;

  if (!bookId) {
    return NextResponse.json(
      { ok: false, error: "Cal especificar l'id del llibre" },
      { status: 400 }
    );
  }

  const book: GoogleBook = await getBookDetails(bookId);
  return NextResponse.json(book);
}
