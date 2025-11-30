import { get } from "http";
import BookDetail from "./_components/BookDetail";
import { getBookDetails } from "../_utils/api_utils";

export default async function Page({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const book = await getBookDetails(bookId);
  return <BookDetail book={book} />;
}
