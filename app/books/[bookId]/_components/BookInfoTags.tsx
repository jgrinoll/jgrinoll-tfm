import { GoogleBook } from "@/app/_lib/models/GoogleBook";
import { Flex } from "antd";
import React from "react";
import InfoTag from "./InfoTag";

interface BookInfoTagsProps {
  book: GoogleBook;
}
const BookInfoTags: React.FC<BookInfoTagsProps> = ({ book }) => {
  const languageNames = new Intl.DisplayNames(["ca"], {
    type: "language",
  });
  let language = languageNames.of(book.volumeInfo.language);
  if (language)
    language = language.charAt(0).toUpperCase() + language?.slice(1); // Capitalize first character

  return (
    <Flex justify="space-evenly" align="center">
      <InfoTag
        label="Pàgines"
        value={book.volumeInfo.pageCount}
        iconSrc="/open-book-icon.png"
      />
      <InfoTag
        label="Idioma"
        value={language ?? "Desconegut"}
        iconSrc="/earth-icon.png"
      />
      <InfoTag
        label="Editorial"
        value={book.volumeInfo.publisher ?? "Desconegut"}
        iconSrc="/building-icon.png"
      />
    </Flex>
  );
};

export default BookInfoTags;
