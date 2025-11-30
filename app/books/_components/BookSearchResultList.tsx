"use client";
import { GoogleBook } from "@/app/_lib/models/GoogleBook";
import Paragraph from "antd/es/typography/Paragraph";
import React from "react";
import BookCard from "./BookCard";

interface BookSearchResultListProps {
  books: GoogleBook[];
}
const BookSearchResultList: React.FC<BookSearchResultListProps> = ({
  books,
}) => {
  if (!books || books.length === 0) {
    return <Paragraph>No s&apos;han trobat llibres.</Paragraph>;
  }

  // TODO - Implement infinite scroll
  return (
    <>
      <ul style={{ listStyleType: "none", padding: 5 }}>
        {books.map((book) => {
          return (
            <li key={book.id}>
              <BookCard book={book} />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default BookSearchResultList;
