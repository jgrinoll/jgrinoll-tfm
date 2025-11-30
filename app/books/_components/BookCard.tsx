"use client";
import { GoogleBook } from "@/app/_lib/models/GoogleBook";
import { Button, Card, Col, Flex, Row } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import React from "react";
import BookCover from "./BookCover";
import ReviewsInfo from "./ReviewsInfo";
import AddToListButton from "./AddToListButton";

interface BookCardProps {
  book: GoogleBook;
}
const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const router = useRouter();
  return (
    <Card key={book.id} style={{ marginBottom: "16px" }}>
      <Row>
        <Col span={8}>
          <Flex
            justify="center"
            align="center"
            style={{ height: "100%", width: "100%" }}
          >
            <BookCover imageLinks={book.volumeInfo.imageLinks} />
          </Flex>
        </Col>
        <Col span={16} style={{ paddingLeft: "16px" }}>
          <Flex vertical style={{ width: "100%", height: "100%" }}>
            <Title level={5} style={{ margin: 0 }}>
              {book.volumeInfo.title}
            </Title>
            <Paragraph style={{ margin: 0 }}>
              <small>{book.volumeInfo.authors?.join(", ")}</small>
            </Paragraph>
            <ReviewsInfo bookId={book.id} />
            <Flex
              justify="space-evenly"
              style={{
                marginTop: "auto",
                paddingTop: ".5rem",
                marginBottom: ".5rem",
              }}
            >
              <Button
                type="primary"
                size="small"
                onClick={() => router.push(`/books/${book.id}`)}
              >
                Veure detall
              </Button>
              <AddToListButton bookId={book.id} />
              {/* <Button
                type="primary"
                size="small"
                onClick={() => router.push(`/books/${book.id}`)}
              >
                Vull Llegir
              </Button> */}
            </Flex>
          </Flex>
        </Col>
      </Row>
    </Card>
  );
};

export default BookCard;
