import "server-only";
import { getBookDetails } from "../_utils/api_utils";
import BookDetail from "./_components/BookDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const book = await getBookDetails(bookId);
  return <BookDetail book={book} />;
}
