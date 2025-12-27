"use client";
import { GoogleBook } from "@/app/_lib/models/GoogleBook";
import { Button, Card, Col, Flex, Row, Tag } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { useRouter } from "next/navigation";
import React from "react";
import BookCover from "./BookCover";
import ReviewsInfo from "./ReviewsInfo";
import AddToListButton from "./AddToListButton";
import { UserBook } from "@/app/_lib/models/UserBook";

interface BookCardProps {
  book: GoogleBook;
  userBook?: UserBook;
}
const BookCard: React.FC<BookCardProps> = ({ book, userBook }) => {
  const router = useRouter();
  return (
    <Card key={book.id} style={{ marginBottom: "16px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={6} lg={5} xl={4}>
          <Flex
            justify="center"
            align="center"
            style={{ height: "100%", width: "100%" }}
          >
            <BookCover imageLinks={book.volumeInfo.imageLinks} />
          </Flex>
        </Col>
        <Col xs={24} sm={16} md={18} lg={19} xl={20}>
          <Flex vertical style={{ width: "100%", height: "100%" }}>
            <Title level={5} style={{ margin: 0 }}>
              {book.volumeInfo.title}
            </Title>
            <Paragraph style={{ margin: 0 }}>
              <small>{book.volumeInfo.authors?.join(", ")}</small>
            </Paragraph>
            
            <Flex gap={8} wrap="wrap" style={{ marginTop: "0.5rem" }} className="book-metadata">
              {book.volumeInfo.publishedDate && (
                <Text type="secondary" style={{ fontSize: "0.875rem" }}>
                  {new Date(book.volumeInfo.publishedDate).getFullYear()}
                </Text>
              )}
              {book.volumeInfo.pageCount && (
                <Text type="secondary" style={{ fontSize: "0.875rem" }}>
                  • {book.volumeInfo.pageCount} pàgines
                </Text>
              )}
              {book.volumeInfo.publisher && (
                <Text type="secondary" style={{ fontSize: "0.875rem" }}>
                  • {book.volumeInfo.publisher}
                </Text>
              )}
            </Flex>

            {book.volumeInfo.description && (
              <Paragraph 
                ellipsis={{ rows: 2 }}
                style={{ marginTop: "0.5rem", marginBottom: "0.5rem", fontSize: "0.875rem" }}
                className="book-description"
              >
                {book.volumeInfo.description}
              </Paragraph>
            )}

            <ReviewsInfo bookId={book.id} />

            {book.volumeInfo.categories && book.volumeInfo.categories.length > 0 && (
              <Flex gap={4} wrap="wrap" style={{ marginTop: "0.5rem" }} className="book-categories">
                {book.volumeInfo.categories.slice(0, 3).map((category, idx) => (
                  <Tag key={idx} style={{ fontSize: "0.75rem", margin: 0 }}>
                    {category}
                  </Tag>
                ))}
              </Flex>
            )}

            <Flex
              justify="space-evenly"
              style={{
                marginTop: "auto",
                paddingTop: ".5rem",
                marginBottom: ".5rem",
              }}
              wrap="wrap"
              gap={8}
            >
              <Button
                type="primary"
                size="small"
                onClick={() => router.push(`/books/${book.id}`)}
              >
                Veure detall
              </Button>
              <AddToListButton bookId={book.id} initialUserBook={userBook} />
            </Flex>
          </Flex>
        </Col>
      </Row>
    </Card>
  );
};

export default BookCard;
