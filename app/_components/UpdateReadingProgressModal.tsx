"use client";
import type { Callbacks } from "@rc-component/form/lib/interface";
import {
  Button,
  Flex,
  Form,
  InputNumber,
  message,
  Modal,
  ModalProps,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import {
  bookReviewModalBookId,
  bookReviewModalOpen,
  updateReadingProgressModalBookId,
  updateReadingProgressModalOpen,
} from "../_lib/jotai/atoms";
import Book from "../_lib/models/Book";
import { ReadingProgress } from "../_lib/models/ReadingProgress";
import { UserBook } from "../_lib/models/UserBook";

type FieldType = {
  pageCount: number;
  percentage: number;
};

// Add option to pass the book directly instead of bookid
const UpdateReadingProgressModal: React.FC<ModalProps> = ({ ...props }) => {
  const [open, setOpen] = useAtom(updateReadingProgressModalOpen);
  const bookId = useAtomValue(updateReadingProgressModalBookId);
  const setReviewModalOpen = useSetAtom(bookReviewModalOpen);
  const setReviewModalBookId = useSetAtom(bookReviewModalBookId);
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState<Book | undefined>();
  const [userBook, setUserBook] = useState<UserBook | undefined>();
  const [currentProgress, setCurrentProgress] = useState<
    ReadingProgress | undefined
  >();
  const [form] = useForm();

  console.log(
    `(UpdateReadingProgressModal) My state is open: ${open} | book: ${bookId}`
  );

  useEffect(() => {
    form.resetFields(); // Update the default values
  }, [book, userBook, currentProgress, form]);

  useEffect(() => {
    const getBookInfo = async () => {
      // Reset state when changing book
      setBook(undefined);
      setUserBook(undefined);
      setCurrentProgress(undefined);
      form.resetFields();

      // TODO - Canviar això i gestionar-ho des de jotai perquè es quedi el component en suspense
      if (!bookId) {
        setOpen(false);
        return;
      }

      const [bookResponse, userBookResponse, readingProgressResponse] =
        await Promise.all([
          fetch(`/api/book/${bookId}`),
          fetch(`/api/book/${bookId}/user`),
          fetch(`/api/book/${bookId}/user/progress`),
        ]);

      if (!bookResponse.ok || !userBookResponse.ok) {
        message.error("Error carregant les dades del llibre");
        return;
      }

      const [book, userBook, readingProgress] = await Promise.all([
        bookResponse.json(),
        userBookResponse.json(),
        readingProgressResponse.json(),
      ]);
      console.log("Got the book ", book);

      setBook(book);
      setUserBook(userBook);
      if (readingProgressResponse.ok) setCurrentProgress(readingProgress);
      setLoading(false);
    };

    console.log("Triggering getBookInfo");

    getBookInfo();
  }, [bookId, setOpen]);

  const onFinish: Callbacks<FieldType>["onFinish"] = async (values) => {
    setLoading(true);

    const response = await fetch(`api/book/${bookId}/user/progress`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const data = await response.json();
      message.success("S'ha actualitzat el progrés correctament.");
      
      if (data.levelUp?.leveledUp) {
        message.success(`🎉 Enhorabona! Has pujat al nivell ${data.levelUp.newLevel}!`, 5);
      }
      
      setOpen(false);
    } else {
      message.error("Hi ha hagut un error actualitzant el progrés de lectura.");
    }

    setLoading(false);
  };

  const onBookFinish = async () => {
    setLoading(true);

    const response = await fetch(`/api/book/${bookId}/user/finish`, {
      method: "POST",
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const data = await response.json();
      message.success(`Has acabat de llegir ${book?.title}!`);
      
      if (data.levelUp?.leveledUp) {
        message.success(`🎉 Enhorabona! Has pujat al nivell ${data.levelUp.newLevel}!`, 5);
      }
      
      setOpen(false);
      setReviewModalBookId(bookId);
      setReviewModalOpen(true);
    } else {
      message.error("Hi ha hagut un error marcant el llibre com a llegit.");
    }

    console.log("User finished the book!");
    setLoading(false);
  };

  const closeModal = () => setOpen(false);

  const onChangePercentage = (percentage: number | null) => {
    if (!percentage || !book?.page_count) {
      form.setFieldValue("pageCount", null);
      return;
    }

    const calculatedPageCount = book.page_count * (percentage / 100);
    form.setFieldValue("pageCount", Math.round(calculatedPageCount));
  };

  const onChangePageCount = (pageCount: number | null) => {
    console.log("onChangePageCount", pageCount);

    if (!pageCount || !book?.page_count) {
      form.setFieldValue("percentage", null);
      return;
    }

    const calculatedPercentage =
      Math.round((pageCount / book.page_count) * 100 * 100) / 100;
    form.setFieldValue("percentage", calculatedPercentage);
  };

  if (!book) {
    return <></>;
  }

  console.log("Book page count is ", book.page_count);

  // TODO - El llibre pot no tenir total de pàgines. Cal modificar aquest component perquè funcioni correctament si és el cas.
  // TODO - Mostrar el progrés actual de l'usuari
  return (
    <>
      <Modal
        {...props}
        onCancel={closeModal}
        onOk={closeModal}
        footer={null}
        open={open}
        title={`Actualitació de progrés`}
      >
        <Flex justify="center" align="center">
          {book && (
            <img
              src={book?.thumbnail}
              alt="Portada del llibre"
              style={{
                maxHeight: 200,
                paddingTop: "1rem",
                paddingBottom: "1.5rem",
              }}
            />
          )}
        </Flex>
        <Flex justify="center" align="center">
          <Form
            name="login-form"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            onFinish={onFinish}
            form={form}
            layout="vertical"
            initialValues={{
              pageCount: currentProgress?.pages_read ?? 0,
              percentage: currentProgress?.percentage ?? 0,
            }}
          >
            <Form.Item<FieldType>
              label="Pàgina"
              name="pageCount"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value && !getFieldValue("percentage")) {
                      return Promise.reject(
                        new Error(
                          "Has d'especificar el nombre de pàgines o el percentatge!"
                        )
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <InputNumber
                max={book?.page_count !== 0 ? book.page_count : undefined}
                min={0}
                suffix={
                  !!book.page_count
                    ? `/ ${book?.page_count} pàgines`
                    : `pàgines`
                }
                onChange={onChangePageCount}
              />
            </Form.Item>
            {!!book.page_count && (
              <Form.Item<FieldType>
                label="Percentatge de progrés"
                name="percentage"
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value && !getFieldValue("pageCount")) {
                        return Promise.reject(
                          new Error(
                            "Has d'especificar el nombre de pàgines o el percentatge!"
                          )
                        );
                      } else {
                        return Promise.resolve();
                      }
                    },
                  }),
                ]}
              >
                <InputNumber
                  max={100}
                  min={0}
                  suffix="%"
                  onChange={onChangePercentage}
                />
              </Form.Item>
            )}
            <p style={{ textAlign: "right" }}>
              <a href="#" onClick={onBookFinish}>
                Has acabat el llibre?
              </a>
            </p>
            <Flex justify="center" gap={10}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Guardar progrés
              </Button>
            </Flex>
          </Form>
        </Flex>
      </Modal>
    </>
  );
};

export default UpdateReadingProgressModal;
