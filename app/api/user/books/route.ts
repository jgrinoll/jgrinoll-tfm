import { getSessionInfo } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import { GoogleBook } from "@/app/_lib/models/GoogleBook";
import { UserBook } from "@/app/_lib/models/UserBook";
import { searchBooks } from "@/app/books/_utils/api_utils";
import { NextRequest, NextResponse } from "next/server";
import "server-only";

export async function GET(req: NextRequest) {
  let books: GoogleBook[] = [];
  let query = "";
  const searchParams = req.nextUrl.searchParams;

  const q = searchParams.get("q");
  const startIndexParam = searchParams.get("startIndex");
  /* const subject = searchParams.get("subject") */

  if (searchParams && q) {
    query = Array.isArray(q) ? q[0] : q;
    const startIndex = Array.isArray(startIndexParam)
      ? parseInt(startIndexParam[0])
      : parseInt(startIndexParam ?? "0");

    const result = await searchBooks(query, startIndex);

    books = result.items || [];
  }
}
