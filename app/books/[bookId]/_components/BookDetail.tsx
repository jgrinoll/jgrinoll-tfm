import { GoogleBook } from "@/app/_lib/models/GoogleBook";
import { Col, Flex, Row, Space } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import BookCover from "../../_components/BookCover";
import ReviewsInfo from "../../_components/ReviewsInfo";
import BookInfoTags from "./BookInfoTags";
import RelatedBookList from "./RelatedBookList";
import BackButton from "./BackButton";
import AddToListButton from "../../_components/AddToListButton";
import ReviewList from "./ReviewList";
import BookDescription from "./BookDescription";

interface BookDetailProps {
  book: GoogleBook;
}
const BookDetail: React.FC<BookDetailProps> = ({ book }) => {
  return (
    <Space vertical style={{ width: "100%" }}>
      <BackButton />
      <Title level={1} style={{ margin: 0 }}>
        {book.volumeInfo.title}
      </Title>
      <Title level={2} style={{ margin: 0, fontWeight: "normal" }}>
        {book.volumeInfo.authors?.join(", ")}
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={10} lg={8} xl={6}>
          <Flex justify="center" align="center">
            <BookCover imageLinks={book.volumeInfo.imageLinks} size="largest" />
          </Flex>
        </Col>
        <Col xs={24} sm={24} md={14} lg={16} xl={18}>
          <Space vertical style={{ width: "100%" }}>
            <Flex justify="center">
              <AddToListButton bookId={book.id} />
            </Flex>
            <BookDescription description={book.volumeInfo.description ?? ""} />
          </Space>
        </Col>
      </Row>
      <BookInfoTags book={book} />
      <ReviewsInfo bookId={book.id} />
      <ReviewList bookId={book.id} />
      <RelatedBookList book={book} />
    </Space>
  );
};

export default BookDetail;
