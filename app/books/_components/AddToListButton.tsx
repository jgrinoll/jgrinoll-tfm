import {
  updateReadingProgressModalBookId,
  updateReadingProgressModalOpen,
  userDataAtom,
} from "@/app/_lib/jotai/atoms";
import List, { ListsEnum } from "@/app/_lib/models/ListsEnum";
import { UserBook } from "@/app/_lib/models/UserBook";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, message, Space } from "antd";
import { useAtom, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import LoginModal from "@/app/_components/auth/LoginModal";
import RegisterModal from "@/app/_components/auth/RegisterModal";
interface AddToListButtonProps {
  bookId: string;
}
const AddToListButton: React.FC<AddToListButtonProps> = ({ bookId }) => {
  const [userBook, setUserBook] = useState<UserBook | undefined>();
  const [refetchUserBook, setRefetchUserBook] = useState(0);
  const setUpdateReadingProgressModalOpen = useSetAtom(
    updateReadingProgressModalOpen
  );
  const setUpdateReadingProgressModalBookId = useSetAtom(
    updateReadingProgressModalBookId
  );

  const [loading, setLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [userData, setUserData] = useAtom(userDataAtom);

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
    const fetchBook = async (bookId: string) => {
      // Fetch book data from database
      // TODO - Session could be expired, add catch for errors 401 and update website accordingly.
      const response = await fetch(`/api/book/${bookId}/user`);
      if (response.ok) {
        const responseBody = await response.json();
        setUserBook(responseBody as UserBook);
      } else {
        switch (response.status) {
          case 404:
            // User doesn't have the book in any list
            // No errors shown
            break;
          case 401:
            // User session is expired or invalid
            setUserData(null);
            break;
          default:
            message.error(
              `Error inesperat recollint les dades del llibre ${bookId}`
            );
        }
      }
    };

    if (userData) {
      fetchBook(bookId);
    }
  }, [bookId, refetchUserBook, userData, setUserData]);

  const onAddToList = async (list: List) => {
    setLoading(true);

    const response = await fetch("/api/user/list", {
      method: "POST",
      body: JSON.stringify({ list: list, bookId: bookId }),
    });

    if (response.ok) {
      message.success("S'ha afegit el llibre a la llista.");
      setRefetchUserBook((val) => val + 1);
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
