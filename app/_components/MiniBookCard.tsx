"use client";
import { Spin } from "antd";
import BookCover from "../books/_components/BookCover";
import Paragraph from "antd/es/typography/Paragraph";
import styles from "./MiniBookCard.module.css";
import { getShortTitle } from "../_lib/utils/book_utils";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface RelatedBookCardProps {
  thumbnail?: string;
  title: string;
  href: string;
}

const MiniBookCard: React.FC<RelatedBookCardProps> = ({
  thumbnail,
  title,
  href,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <div
      onClick={handleClick}
      style={{ cursor: "pointer", position: "relative" }}
    >
      {isPending && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <div className={styles.imageContainer}>
        {thumbnail && <BookCover preview={false} src={thumbnail} />}
      </div>
      <Paragraph
        strong
        style={{
          textAlign: "center",
          width: "100%",
          margin: 0,
          textWrap: "wrap",
          maxWidth: "200px",
        }}
      >
        {getShortTitle(title)}
      </Paragraph>
    </div>
  );
};

export default MiniBookCard;
