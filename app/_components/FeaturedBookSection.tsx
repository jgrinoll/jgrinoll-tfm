import "server-only";
import Title from "antd/es/typography/Title";
import React from "react";
import { Button, Col, Flex, message, Row, Space } from "antd";
import Book from "../_lib/models/Book";
import { GET, getBook } from "../api/book/[id]/route";
import Parser from "html-react-parser";
import Paragraph from "antd/es/typography/Paragraph";
import BookCover from "../books/_components/BookCover";
import { getLargestAvailableThumbnail } from "../books/_utils/api_utils";
import Link from "next/link";

const getShortTitle = (title: string) => {
  const verticalLineSeparatorIndex = title.indexOf("|");
  const parenthesisSeparatorIndex = title.indexOf("(");
  let separatorIndex = -1;
  if (verticalLineSeparatorIndex !== -1 && parenthesisSeparatorIndex !== -1) {
    separatorIndex = Math.min(
      verticalLineSeparatorIndex,
      parenthesisSeparatorIndex
    );
  } else {
    separatorIndex = Math.max(
      verticalLineSeparatorIndex,
      parenthesisSeparatorIndex
    );
  }

  if (separatorIndex === -1) return title;

  return title.substring(0, separatorIndex);
};

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
      <Title level={1} style={{ textAlign: "center", margin: 0 }}>
        Llibre destacat
      </Title>
      <Title
        level={2}
        style={{ textAlign: "center", margin: 0, fontWeight: "normal" }}
      >
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
            <Button type="primary">
              <Link href={`/books/${book.id}`}>Veure Detall</Link>
            </Button>
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
