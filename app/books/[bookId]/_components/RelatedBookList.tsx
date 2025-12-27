import { GoogleBook } from "@/app/_lib/models/GoogleBook";
import React from "react";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { getShortTitle } from "@/app/_lib/utils/book_utils";
import MiniBookCard from "@/app/_components/MiniBookCard";
import styles from "./RelatedBookList.module.css";
import { getRelatedBooks } from "@/app/books/_utils/api_utils";

interface RelatedBookListProps {
  book: GoogleBook;
}

const RelatedBookList: React.FC<RelatedBookListProps> = async ({ book }) => {
  const relatedBooks = await getRelatedBooks(book);

  if (relatedBooks.length === 0) {
    return null;
  }

  return (
    <section style={{ backgroundColor: "#fdf6f0" }}>
      <Title level={2}>Llibres relacionats</Title>
      <Paragraph>Descobreix més llibres similars</Paragraph>
      <ul className={styles["related-books-list"]}>
        {relatedBooks.map((relatedBook) => {
          const shortTitle = getShortTitle(relatedBook.volumeInfo.title);
          const thumbnail = relatedBook.volumeInfo.imageLinks?.thumbnail;

          return (
            <li key={relatedBook.id}>
              <MiniBookCard
                thumbnail={thumbnail}
                title={shortTitle}
                href={`/books/${relatedBook.id}`}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default RelatedBookList;
