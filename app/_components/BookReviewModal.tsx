"use client";
import type { Callbacks } from "@rc-component/form/lib/interface";
import {
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  ModalProps,
  Rate,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import {
  bookReviewModalBookId,
  bookReviewModalOpen,
} from "../_lib/jotai/atoms";
import Book from "../_lib/models/Book";
import { Review } from "../_lib/models/Review";
import { getShortTitle } from "../_lib/utils/book_utils";
import { authFetch } from "../_lib/utils/authFetch";

type FieldType = {
  rating: number;
  review_text: string;
};

const BookReviewModal: React.FC<ModalProps> = ({ ...props }) => {
  const [open, setOpen] = useAtom(bookReviewModalOpen);
  const [bookId] = useAtom(bookReviewModalBookId);
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState<Book | undefined>();
  const [existingReview, setExistingReview] = useState<Review | undefined>();
  const [form] = useForm();

  useEffect(() => {
    form.resetFields();
  }, [book, existingReview, form]);

  useEffect(() => {
    const getBookInfo = async () => {
      setBook(undefined);
      setExistingReview(undefined);
      form.resetFields();

      if (!bookId) {
        setOpen(false);
        return;
      }

      const [bookResponse, reviewResponse] = await Promise.all([
        fetch(`/api/book/${bookId}`),
        authFetch(`/api/book/${bookId}/review`),
      ]);

      if (!bookResponse.ok) {
        message.error("Error carregant les dades del llibre");
        return;
      }

      const book = await bookResponse.json();
      setBook(book);

      if (reviewResponse.ok) {
        const review = await reviewResponse.json();
        setExistingReview(review);
      }

      setLoading(false);
    };

    getBookInfo();
  }, [bookId, setOpen, form]);

  const onFinish: Callbacks<FieldType>["onFinish"] = async (values) => {
    setLoading(true);

    const response = await authFetch(`/api/book/${bookId}/review`, {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (response.ok) {
      message.success("S'ha guardat la ressenya correctament.");
      setOpen(false);
    } else {
      message.error("Hi ha hagut un error guardant la ressenya.");
    }

    setLoading(false);
  };

  const closeModal = () => setOpen(false);

  if (!book) {
    return <></>;
  }

  return (
    <>
      <Modal
        {...props}
        onCancel={closeModal}
        onOk={closeModal}
        footer={null}
        open={open}
        title={`Ressenya de ${getShortTitle(book.title)}`}
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
            name="review-form"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            form={form}
            layout="vertical"
            initialValues={{
              rating: existingReview?.rating ?? 0,
              review_text: existingReview?.review_text ?? "",
            }}
            style={{ width: "100%" }}
          >
            <Form.Item<FieldType>
              label="Puntuació"
              name="rating"
              rules={[
                {
                  required: true,
                  message: "Has de donar una puntuació!",
                },
                {
                  type: "number",
                  min: 1,
                  max: 5,
                  message: "La puntuació ha de ser entre 1 i 5",
                },
              ]}
            >
              <Rate allowClear={false} />
            </Form.Item>
            <Form.Item<FieldType>
              label="Ressenya"
              name="review_text"
              rules={[
                {
                  required: true,
                  message: "Has d'escriure una ressenya!",
                },
                {
                  min: 10,
                  message: "La ressenya ha de tenir almenys 10 caràcters",
                },
              ]}
            >
              <Input.TextArea
                rows={6}
                placeholder="Escriu la teva opinió sobre el llibre..."
                maxLength={2000}
                showCount
              />
            </Form.Item>
            <Flex justify="center" gap={10}>
              <Button onClick={closeModal}>Cancel·lar</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Guardar ressenya
              </Button>
            </Flex>
          </Form>
        </Flex>
      </Modal>
    </>
  );
};

export default BookReviewModal;
