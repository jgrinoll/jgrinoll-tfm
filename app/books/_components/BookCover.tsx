import { ImageLinks } from "@/app/_lib/models/Book";
import { Image } from "antd";
import React from "react";

interface BookCoverProps {
  imageLinks: ImageLinks;
}
const BookCover: React.FC<BookCoverProps> = ({ imageLinks }) => {
  console.log("Trying to display cover of: ", imageLinks);
  if (!imageLinks) {
    // TODO - Add a placeholder image here
    return null;
  }

  // Get any of the available sizes, prioritizing larger ones
  // He vist que al llistar només hi ha smallThumbnail i thumbnail
  const src =
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail ||
    // TODO - Add a placeholder image here
    "";

  return (
    <Image
      src={src}
      style={{
        borderTopRightRadius: "1rem",
        borderBottomRightRadius: "1rem",
        padding: 5,
      }}
    />
  );
};

export default BookCover;
