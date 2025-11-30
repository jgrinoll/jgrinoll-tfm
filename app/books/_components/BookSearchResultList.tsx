"use client";
import { Book } from "@/app/_lib/models/Book";
import Paragraph from "antd/es/typography/Paragraph";
import React from "react";
import BookCard from "./BookCard";

interface BookSearchResultListProps {
  books: Book[];
}
const BookSearchResultList: React.FC<BookSearchResultListProps> = ({
  books,
}) => {
  console.log("Displaying books: ", books);

  if (!books || books.length === 0) {
    return <Paragraph>No s&apos;han trobat llibres.</Paragraph>;
  }

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
