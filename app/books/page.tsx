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
  // TODO - Support a "subject" searchParam with the category.
  let books: GoogleBook[] = [];
  const searchParams = await searchParamsPromise;

  const getBooks = async (page = 0) => {
    "use server";
    let query = "";
    let finalQuery = "";

    const searchParams = await searchParamsPromise;
    if (searchParams && searchParams.q) {
      query = Array.isArray(searchParams.q)
        ? searchParams.q[0]
        : searchParams.q;

      finalQuery = query;
      if (searchParams.subject) {
        finalQuery +=
          " " + Array.isArray(searchParams.subject)
            ? searchParams.subject[0]
            : searchParams.subject;
      }
      return await searchBooks(finalQuery, page);
    }

    return { items: [], kind: "", totalItems: 0 };
  };
  books = (await getBooks()).items || [];
  return (
    <>
      <Paragraph>
        <b>Mostrant resultats per</b> &quot;{searchParams.q}&quot;
      </Paragraph>
      {/* TODO - Add filter button */}
      <Suspense fallback={<Spin />}>
        <BookSearchResultList books={books} getBooks={getBooks} />
      </Suspense>
    </>
  );
};

export default Page;
