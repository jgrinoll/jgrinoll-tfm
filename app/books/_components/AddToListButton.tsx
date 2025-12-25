'use client'
import LoginModal from "@/app/_components/auth/LoginModal";
import RegisterModal from "@/app/_components/auth/RegisterModal";
import {
  bookReviewModalBookId,
  bookReviewModalOpen,
  updateReadingProgressModalBookId,
  updateReadingProgressModalOpen,
  userDataAtom,
} from "@/app/_lib/jotai/atoms";
import { authFetch } from "@/app/_lib/utils/authFetch";
import List, { ListsEnum } from "@/app/_lib/models/ListsEnum";
import { UserBook } from "@/app/_lib/models/UserBook";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, message, Space } from "antd";
import dayjs from "dayjs";
import { useAtom, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
interface AddToListButtonProps {
  bookId: string;
  initialUserBook?: UserBook;
}
const AddToListButton: React.FC<AddToListButtonProps> = ({
  bookId,
  initialUserBook,
}) => {
  const [userBook, setUserBook] = useState<UserBook | undefined>(
    initialUserBook
  );
  const setUpdateReadingProgressModalOpen = useSetAtom(
    updateReadingProgressModalOpen
  );
  const setUpdateReadingProgressModalBookId = useSetAtom(
    updateReadingProgressModalBookId
  );
  const setBookReviewModalOpen = useSetAtom(bookReviewModalOpen);
  const setBookReviewModalBookId = useSetAtom(bookReviewModalBookId);

  const [loading, setLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [userData] = useAtom(userDataAtom);

  const isAuthenticated = (): boolean => userData !== null;

  const handleAuthenticatedAction = (action: () => void) => {
    if (!isAuthenticated()) {
      setLoginModalOpen(true);
      return;
    }
    action();
  };

  const onRegisterSelected = () => {
    setRegisterModalOpen(true);
    setLoginModalOpen(false);
  };

  useEffect(() => {
    setUserBook(initialUserBook);
  }, [initialUserBook]);

  const onAddToList = async (list: List) => {
    setLoading(true);

    const response = await authFetch("/api/user/list", {
      method: "POST",
      body: JSON.stringify({ list: list, bookId: bookId }),
    });

    if (response.ok) {
      message.success("S'ha afegit el llibre a la llista.");
      const responseBody = await response.json();
      if (responseBody.id) {
        setUserBook({
          id: responseBody.id,
          book_id: bookId,
          user_id: userData?.id || 0,
          status: list,
          created_at: dayjs(),
          updated_at: dayjs(),
        });
      }

      if (list === "LLEGIT") {
        setBookReviewModalBookId(bookId);
        setBookReviewModalOpen(true);
      }
    } else {
      message.error("Hi ha hagut un error afegint el llibre a la llista.");
    }

    setLoading(false);
  };

  if (!userBook || userBook.status === "VULL_LLEGIR") {
    const listOptions = Object.keys(ListsEnum)
      .map((key) => {
        return {
          key: key,
          label: `${userBook ? 'Moure a "' : 'Afegir a "'}${
            ListsEnum[key as List]
          }"`,
        };
      })
      .filter((option) => option.key !== userBook?.status);

    return (
      <>
        <Space.Compact>
          <Button
            size="small"
            type="primary"
            onClick={() =>
              handleAuthenticatedAction(() => onAddToList("VULL_LLEGIR"))
            }
            disabled={userBook?.status === "VULL_LLEGIR"}
            loading={loading}
          >
            {!userBook || userBook.status === "VULL_LLEGIR"
              ? "Vull llegir"
              : ListsEnum[userBook.status]}
          </Button>
          <Dropdown
            menu={{
              items: listOptions,
              onClick: ({ key }) =>
                handleAuthenticatedAction(() => onAddToList(key as List)),
            }}
            placement="bottomRight"
          >
            <Button
              size="small"
              type="primary"
              icon={<DownOutlined />}
              disabled={loading}
            />
          </Dropdown>
        </Space.Compact>
        <LoginModal
          open={loginModalOpen}
          onLogin={() => setLoginModalOpen(false)}
          onCancel={() => setLoginModalOpen(false)}
          onRegisterSelected={onRegisterSelected}
        />
        <RegisterModal
          open={registerModalOpen}
          onRegister={() => setRegisterModalOpen(false)}
          onCancel={() => setRegisterModalOpen(false)}
        />
      </>
    );
  }

  const onUpdateProgress = () => {
    console.log(`Trying to open update progress modal with book id ${bookId}`);

    setUpdateReadingProgressModalBookId(bookId);
    setUpdateReadingProgressModalOpen(true);
  };
  if (userBook.status === "LLEGINT") {
    return (
      <Button type="primary" size="small" onClick={onUpdateProgress}>
        Actualitzar progrés
      </Button>
    );
  }

  if (userBook.status === "LLEGIT") {
    return (
      <Button type="primary" size="small" disabled>
        Llegit
        {/* // TODO - Canviar això, és lleig. Posar una icona de l'estil "Ben fet! Està llegit!" */}
      </Button>
    );
  }

  return <></>;
};

export default AddToListButton;
