import "server-only";
import { searchBooks } from "./_utils/api_utils";
import BookSearchResultList from "./_components/BookSearchResultList";
import { GoogleBook } from "../_lib/models/GoogleBook";
import Paragraph from "antd/es/typography/Paragraph";
import { Suspense } from "react";
import { Spin } from "antd";

const Page = async ({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  let books: GoogleBook[] = [];
  let query = "";

  const searchParams = await searchParamsPromise;
  if (searchParams && searchParams.q) {
    query = Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q;

    const result = await searchBooks(query);

    books = result.items || [];
  }
  return (
    <>
      <Paragraph>
        <b>Mostrant resultats per</b> "{query}"
      </Paragraph>
      {/* TODO - Add filter button */}
      <Suspense fallback={<Spin />}>
        <BookSearchResultList books={books} />
      </Suspense>
    </>
  );
};

export default Page;
