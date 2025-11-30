import { Book } from "@/app/_lib/models/Book";
import React from "react";

interface RelatedBookListProps {
  book: Book;
}
const RelatedBookList: React.FC<RelatedBookListProps> = ({ book }) => {
  // TODO
  return <div>RelatedBookList ({book.id})</div>;
};

export default RelatedBookList;
