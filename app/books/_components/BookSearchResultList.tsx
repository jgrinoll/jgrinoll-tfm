"use client";
import {
  GoogleBook,
  GoogleBooksSearchResponse,
} from "@/app/_lib/models/GoogleBook";
import Paragraph from "antd/es/typography/Paragraph";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BookCard from "./BookCard";
import { Flex, Spin } from "antd";
import { UserBook } from "@/app/_lib/models/UserBook";
import { useAtomValue } from "jotai";
import { userDataAtom } from "@/app/_lib/jotai/atoms";

interface BookSearchResultListProps {
  books: GoogleBook[];
  getBooks: (page?: number) => Promise<GoogleBooksSearchResponse>;
}
const BookSearchResultList: React.FC<BookSearchResultListProps> = ({
  books: initialBooks,
  getBooks,
}) => {
  const [books, setBooks] = useState(initialBooks);
  const [currentPage, setCurrentPage] = useState(0);
  const [userBooks, setUserBooks] = useState<Map<string, UserBook>>(new Map());
  const userData = useAtomValue(userDataAtom);

  useEffect(() => {
    if (userData && books.length > 0) {
      const bookIds = books.map((b) => b.id);
      fetch("/api/user/books-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookIds }),
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch user books");
        })
        .then((data: UserBook[]) => {
          const map = new Map(data.map((ub) => [ub.book_id, ub]));
          setUserBooks(map);
        })
        .catch((err) => {
          console.error("Error fetching user books:", err);
        });
    }
  }, [userData, books]);

  const onNext = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const newBooks = await getBooks(nextPage);

    setBooks((lastBooksState) => [...lastBooksState, ...newBooks.items]);
  };

  if (!initialBooks || initialBooks.length === 0) {
    return <Paragraph>No s&apos;han trobat llibres.</Paragraph>;
  }

  // TODO - Implement infinite scroll
  console.log("current page: ", currentPage);
  return (
    <>
      <ul style={{ listStyleType: "none", padding: 5 }}>
        <InfiniteScroll
          dataLength={books.length}
          next={onNext}
          hasMore={true}
          loader={
            <Flex justify="center" align="center">
              <Spin />
            </Flex>
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>No hi ha més resultats</b>
            </p>
          }
        >
          {books.map((book) => {
            return (
              <li key={book.id}>
                <BookCard book={book} userBook={userBooks.get(book.id)} />
              </li>
            );
          })}
        </InfiniteScroll>
      </ul>
    </>
  );
};
// TODO - FLoating button to navigate to top of the page
export default BookSearchResultList;
