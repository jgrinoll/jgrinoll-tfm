import Book from "@/app/_lib/models/Book";
import { Button, message } from "antd";
import React, { useEffect, useState } from "react";

interface AddToListButtonProps {
  bookId: string;
}
const AddToListButton: React.FC<AddToListButtonProps> = ({ bookId }) => {
  const [book, setBook] = useState<Book | undefined>();

  useEffect(() => {
    const fetchBook = async (bookId: string) => {
      // Fetch book data from database
      const response = await fetch(`/api/books/${bookId}`);
      if (response.ok && response.status === 200) {
        const responseBody = await response.json();
        if (response.status === 200) {
          console.log("Book set: ", responseBody as Book);
          setBook(responseBody as Book);
        } else {
          message.error(responseBody.error);
        }
      } else {
        console.log(response);
        message.error(
          `Error inesperat recollint les dades del llibre ${bookId}`
        );
      }
    };

    fetchBook(bookId);
  }, [bookId]);

  return (
    <Button type="primary" size="small">
      Add {book?.id} to list
    </Button>
  );
};

export default AddToListButton;
