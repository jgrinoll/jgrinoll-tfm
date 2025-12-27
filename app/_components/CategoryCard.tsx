"use client";
import { Card, Spin } from "antd";
import BookCover from "../books/_components/BookCover";
import Paragraph from "antd/es/typography/Paragraph";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface CategoryCardProps {
  thumbnail?: string;
  name: string;
  href: string;
}
const CategoryCard: React.FC<CategoryCardProps> = ({
  thumbnail,
  name,
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
            borderRadius: "8px",
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <Card style={{ backgroundColor: "#fbcfe8" }}>
        <div style={{ height: "25vh" }}>
          <BookCover preview={false} src={thumbnail} />
        </div>
        <Paragraph
          strong
          style={{ textAlign: "center", width: "100%", margin: 0 }}
        >
          {name}
        </Paragraph>
      </Card>
    </div>
  );
};

export default CategoryCard;
