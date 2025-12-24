import "server-only";
import { searchBooks } from "./_utils/api_utils";
import BookSearchResultList from "./_components/BookSearchResultList";
import { GoogleBook } from "../_lib/models/GoogleBook";
import Paragraph from "antd/es/typography/Paragraph";
import { Suspense } from "react";
import { Spin } from "antd";
import SubjectFilter from "./_components/SubjectFilter";

const Page = async ({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  let books: GoogleBook[] = [];
  const searchParams = await searchParamsPromise;

  const getBooks = async (page = 0) => {
    "use server";
    let finalQuery = "";

    const searchParams = await searchParamsPromise;
    const q = searchParams.q
      ? Array.isArray(searchParams.q)
        ? searchParams.q[0]
        : searchParams.q
      : "";
    const subject = searchParams.subject
      ? Array.isArray(searchParams.subject)
        ? searchParams.subject[0]
        : searchParams.subject
      : "";

    if (subject && !q) {
      finalQuery = `subject:"${subject}"`;
    } else if (subject && q) {
      finalQuery = `${q} subject:"${subject}"`;
    } else if (q) {
      finalQuery = q;
    }

    if (finalQuery) {
      return await searchBooks(finalQuery, page);
    }

    return { items: [], kind: "", totalItems: 0 };
  };
  books = (await getBooks()).items || [];

  const q = searchParams.q
    ? Array.isArray(searchParams.q)
      ? searchParams.q[0]
      : searchParams.q
    : undefined;
  const subject = searchParams.subject
    ? Array.isArray(searchParams.subject)
      ? searchParams.subject[0]
      : searchParams.subject
    : undefined;

  return (
    <>
      <SubjectFilter subject={subject} searchQuery={q} />
      {searchParams.q && (
        <Paragraph>
          <b>Mostrant resultats per</b> &quot;{searchParams.q}&quot;
        </Paragraph>
      )}
      <Suspense fallback={<Spin />}>
        <BookSearchResultList books={books} getBooks={getBooks} />
      </Suspense>
    </>
  );
};

export default Page;
