import { GoogleBook } from "@/app/_lib/models/GoogleBook";
import React from "react";

interface RelatedBookListProps {
  book: GoogleBook;
}
const RelatedBookList: React.FC<RelatedBookListProps> = ({ book }) => {
  // TODO
  return <div>RelatedBookList ({book.id})</div>;
};

export default RelatedBookList;
