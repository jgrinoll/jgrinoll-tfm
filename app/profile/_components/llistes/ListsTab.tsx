"use client";
import MiniBookCard from "@/app/_components/MiniBookCard";
import Book from "@/app/_lib/models/Book";
import List, { ListsEnum } from "@/app/_lib/models/ListsEnum";
import { UserBook } from "@/app/_lib/models/UserBook";
import UserDTO from "@/app/_lib/models/UserDTO";
import { Flex, message, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import styles from "./ListsTab.module.css";

interface ListsTabProps {
  user: UserDTO;
}
const ListsTab: React.FC<ListsTabProps> = () => {
  const [selectedList, setSelectedList] = useState<List>("LLEGIT");
  const [loading, setLoading] = useState<boolean>(false);
  const [, setUserBooks] = useState<UserBook[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  console.log("Selected list is ", selectedList);

  useEffect(() => {
    const fetchListBooks = async () => {
      setLoading(true);
      const searchParams = new URLSearchParams({ status: selectedList });
      const response = await fetch(
        `/api/user/books?${searchParams.toString()}`
      );

      if (!response.ok) {
        message.error(
          "Hi ha hagut un error recuperant els llibres de la llista"
        );
        setLoading(false);
        return;
      }

      const books = (await response.json()) as UserBook[];
      setUserBooks(books);

      await fetchCachedBooks(books);
      setLoading(false);
    };

    const fetchCachedBooks = async (userBooks: UserBook[]) => {
      console.log("Fetching cached books");

      const responses = await Promise.all(
        userBooks.map((userBook) => fetch(`/api/book/${userBook.book_id}`))
      );

      const newBooks: Book[] = [];
      for (const response of responses) {
        if (!response.ok) {
          message.error(`Error recuperant les dades d'un llibre.`);
          continue;
        } else {
          newBooks.push((await response.json()) as Book);
        }
      }

      setBooks(newBooks);
    };

    fetchListBooks();
  }, [selectedList]);

  return (
    <Flex justify="center" align="center" vertical>
      <Select
        defaultValue="LLEGIT"
        onChange={(val) => setSelectedList(val as List)}
        style={{ width: 200 }}
        options={[
          {
            value: "VULL_LLEGIR",
            label: ListsEnum.VULL_LLEGIR,
          },
          {
            value: "LLEGINT",
            label: ListsEnum.LLEGINT,
          },
          {
            value: "LLEGIT",
            label: ListsEnum.LLEGIT,
          },
        ]}
      />
      <ul className={styles["lists-tab-list"]}>
        {loading && (
          <Flex
            justify="center"
            align="center"
            style={{ width: "100%", height: "100%" }}
          >
            <Spin />
          </Flex>
        )}
        {!loading &&
          books &&
          books.map((book) => (
            <li key={book.id}>
              <MiniBookCard title={book.title} thumbnail={book.thumbnail} />
            </li>
          ))}
      </ul>
    </Flex>
  );
};

export default ListsTab;
