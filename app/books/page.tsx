import "server-only";
import { searchBooks, getBooksByIds } from "./_utils/api_utils";
import BookSearchResultList from "./_components/BookSearchResultList";
import { GoogleBook } from "../_lib/models/GoogleBook";
import Paragraph from "antd/es/typography/Paragraph";
import { Suspense } from "react";
import { Spin } from "antd";
import RatingFilter from "./_components/RatingFilter";
import CategorySelector from "./_components/CategorySelector";
import { getRatedBookIds, filterBooksByText } from "./_utils/rating_utils";

const Page = async ({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  let books: GoogleBook[] = [];
  const searchParams = await searchParamsPromise;

  const getBooks = async (page = 0) => {
    "use server";
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
    const minRatingParam = searchParams.minRating
      ? Array.isArray(searchParams.minRating)
        ? searchParams.minRating[0]
        : searchParams.minRating
      : "";
    const minRating = minRatingParam
      ? Math.max(1, Math.min(5, parseInt(minRatingParam, 10)))
      : 0;

    if (minRating > 0) {
      try {
        const ratedBooks = await getRatedBookIds(minRating, 10, page * 10);
        const bookIds = ratedBooks.map((rb) => rb.book_id);

        if (bookIds.length === 0) {
          return { items: [], kind: "", totalItems: 0 };
        }

        let books = await getBooksByIds(bookIds);

        if (q) {
          books = filterBooksByText(books, q);
        }

        if (subject) {
          books = books.filter((book) =>
            book.volumeInfo.categories?.some((cat) =>
              cat.toLowerCase().includes(subject.toLowerCase())
            )
          );
        }

        return {
          items: books,
          kind: "books#volumes",
          totalItems: books.length,
        };
      } catch (error) {
        console.error("Error fetching books with rating filter:", error);
        return { items: [], kind: "", totalItems: 0 };
      }
    }

    let finalQuery = "";
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
  const minRatingParam = searchParams.minRating
    ? Array.isArray(searchParams.minRating)
      ? searchParams.minRating[0]
      : searchParams.minRating
    : undefined;
  const minRating = minRatingParam
    ? Math.max(1, Math.min(5, parseInt(minRatingParam, 10)))
    : undefined;

  return (
    <>
      {searchParams.q && (
        <Paragraph>
          <b>Mostrant resultats per</b> &quot;{searchParams.q}&quot;
        </Paragraph>
      )}
      <CategorySelector
        subject={subject}
        searchQuery={q}
        minRating={minRating}
      />
      <RatingFilter minRating={minRating} searchQuery={q} subject={subject} />
      <Suspense fallback={<Spin />}>
        <BookSearchResultList
          key={`${q}-${subject}-${minRating}`}
          books={books}
          getBooks={getBooks}
        />
      </Suspense>
    </>
  );
};

export default Page;
