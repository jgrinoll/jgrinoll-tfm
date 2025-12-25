import { ReviewWithUser } from "@/app/_lib/models/ReviewWithUser";
import { Card, Flex, Rate } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Text from "antd/es/typography/Text";
import dayjs from "dayjs";
import React from "react";

interface ReviewCardProps {
  review: ReviewWithUser;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formattedDate = dayjs(review.created_at).format("DD/MM/YYYY");

  return (
    <Card style={{ marginBottom: "16px" }}>
      <Flex vertical gap={8}>
        <Flex justify="space-between" align="center" wrap="wrap">
          <Text strong>{review.username}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formattedDate}
          </Text>
        </Flex>
        <Rate disabled value={review.rating} allowHalf />
        <Paragraph style={{ margin: 0 }}>{review.review_text}</Paragraph>
      </Flex>
    </Card>
  );
};

export default ReviewCard;
