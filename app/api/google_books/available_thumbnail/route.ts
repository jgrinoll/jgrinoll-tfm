import { ImageLinks } from "@/app/_lib/models/GoogleBook";
import { getLargestAvailableThumbnail } from "@/app/books/_utils/api_utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const imageLinks: ImageLinks = await req.json();

  const availableThumbnail = imageLinks
    ? await getLargestAvailableThumbnail(imageLinks)
    : "";
  return NextResponse.json(availableThumbnail);
}
