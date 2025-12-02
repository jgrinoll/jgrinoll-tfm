"use client";
import { message, Progress } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  updateReadingProgressModalBookId,
  updateReadingProgressModalOpen,
  userDataAtom,
} from "../_lib/jotai/atoms";
import Book from "../_lib/models/Book";
import { ReadingProgress } from "../_lib/models/ReadingProgress";
import { UserBook } from "../_lib/models/UserBook";
import BookCover from "../books/_components/BookCover";
import styles from "./ContinueReadingSection.module.css";

export default function ContinueReadingSection() {
  const user = useAtomValue(userDataAtom);
  const setUpdateProgressModalOpen = useSetAtom(updateReadingProgressModalOpen);
  const setUpdateReadingProgressModalBookId = useSetAtom(
    updateReadingProgressModalBookId
  );
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [books, setBooks] = useState<{ [key: string]: Book }>({});
  const [currentProgresses, setCurrentProgresses] = useState<{
    [key: string]: ReadingProgress;
  }>({});

  useEffect(() => {
    if (!user) return;

    const fetchUserReadingBooks = async () => {
      console.log("Fetching user books");
      const searchParams = new URLSearchParams({
        status: "LLEGINT",
      });

      // TODO - Promise.all
      const response = await fetch(
        `/api/user/books?${searchParams.toString()}`
      );
      if (!response.ok) {
        console.log("Erorr recuperant els llibres de l'usuari");

        message.error("Error recuperant els llibres de l'usuari.");
        return;
      }

      console.log("Llegint response body...");
      const userBooks: UserBook[] = await response.json();
      console.log("Llibres de l'usuari recuperats: ", userBooks);
      setUserBooks(userBooks);
      console.log("Books retrieved!", userBooks);

      fetchCachedBooks(userBooks);
      fetchCurrentProgress(userBooks);
    };

    const fetchCachedBooks = async (userBooks: UserBook[]) => {
      console.log("Fetching cached books");

      const responses = await Promise.all(
        userBooks.map((userBook) => fetch(`/api/book/${userBook.book_id}`))
      );

      const newBooks: { [key: string]: Book } = {};
      for (const response of responses) {
        if (!response.ok) {
          message.error(`Error recuperant les dades d'un llibre.`);
          continue;
        } else {
          const book = (await response.json()) as Book;
          newBooks[book.id] = book;
        }
      }
      console.log("New books are ", newBooks);

      setBooks(newBooks);
    };

    const fetchCurrentProgress = async (userBooks: UserBook[]) => {
      console.log("Fetching cached books");

      const responses = await Promise.all(
        userBooks.map((userBook) =>
          fetch(`/api/book/${userBook.book_id}/user/progress`)
        )
      );

      const newProgresses: { [key: string]: ReadingProgress } = {};
      for (const response of responses) {
        if (!response.ok) {
          if (response.status != 404) {
            message.error(`Error recuperant el progrés d'un llibre.`);
          }
          continue;
        } else {
          const progress = (await response.json()) as ReadingProgress;
          newProgresses[progress.book_id] = progress;
        }
      }
      console.log("New progresses are ", newProgresses);

      setCurrentProgresses(newProgresses);
    };

    fetchUserReadingBooks();
  }, [user]);

  if (!user) return null;

  console.log("Books are ", books);

  return (
    <section>
      <Title level={1}>Continuar llegint</Title>
      <Paragraph>Actualitza el progrés dels teus llibres</Paragraph>
      <ul className={styles["continue-reading-list"]}>
        {userBooks.map((userBook) => (
          <li
            key={userBook.book_id}
            onClick={() => {
              console.log(`Book ${userBook.book_id} clicked!`);

              setUpdateProgressModalOpen(true);
              setUpdateReadingProgressModalBookId(userBook.book_id);
            }}
          >
            <BookCover bookId={userBook.book_id} preview={false} />
            {currentProgresses[userBook.book_id] &&
              currentProgresses[userBook.book_id].percentage && (
                <Progress
                  type="circle"
                  percent={currentProgresses[userBook.book_id].percentage}
                  className={styles["progress-indicator"]}
                  size={30}
                  strokeWidth={20}
                  showInfo={false}
                />
              )}
          </li>
        ))}
      </ul>
    </section>
  );
}
