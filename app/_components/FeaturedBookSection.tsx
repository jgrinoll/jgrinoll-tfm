import { Button, Col, Flex, Row, Space } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import Parser from "html-react-parser";
import Link from "next/link";
import React from "react";
import "server-only";
import { getShortTitle } from "../_lib/utils/book_utils";
import { getBook } from "../api/book/[id]/route";
import BookCover from "../books/_components/BookCover";

interface FeaturedBookSectionProps {
  bookId: string;
}
const FeaturedBookSection: React.FC<FeaturedBookSectionProps> = async ({
  bookId,
}) => {
  const book = await getBook(bookId);

  if (!book) return <></>;

  return (
    <section>
      <Title level={1} style={{ marginBottom: 5 }}>
        Llibre destacat
      </Title>
      <Title level={1} style={{ textAlign: "center", marginBottom: ".75rem" }}>
        {getShortTitle(book.title)}
      </Title>
      <Row>
        <Col span={16}>
          <Space vertical>
            <Paragraph
              ellipsis={{
                rows: 9,
                defaultExpanded: false,
              }}
            >
              {Parser(book.description ?? "<b>Sense descripció</b>")}
            </Paragraph>
            <Flex justify="center" align="center">
              <Button type="primary">
                <Link href={`/books/${book.id}`}>Veure Detall</Link>
              </Button>
            </Flex>
          </Space>
        </Col>
        <Col span={8}>
          <Flex
            justify="center"
            align="center"
            style={{ height: "100%", width: "100%" }}
          >
            <BookCover src={book.thumbnail} />
          </Flex>
        </Col>
      </Row>
    </section>
  );
};

export default FeaturedBookSection;
