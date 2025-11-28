import { ImageLinks } from "@/app/_lib/models/Book";
import { Image } from "antd";
import React from "react";

interface BookCoverProps {
  imageLinks: ImageLinks;
}
const BookCover: React.FC<BookCoverProps> = ({ imageLinks }) => {
  console.log("Trying to display cover of: ", imageLinks);
  if (!imageLinks || !imageLinks.thumbnail) {
    // TODO - Add a placeholder image here
    return null;
  }

  return (
    <Image
      src={imageLinks.thumbnail}
      style={{
        borderTopRightRadius: "1rem",
        borderBottomRightRadius: "1rem",
        padding: 5,
      }}
    />
  );
};

export default BookCover;
