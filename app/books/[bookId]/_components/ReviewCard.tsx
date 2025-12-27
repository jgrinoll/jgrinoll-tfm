import { ReviewWithUser } from "@/app/_lib/models/ReviewWithUser";
import { Avatar, Card, Flex, Rate, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
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
    <Card
      style={{
        marginBottom: "16px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
      hoverable
    >
      <Flex gap={16}>
        <Avatar 
          size={48} 
          src={review.avatar_url}
          icon={<UserOutlined />} 
          style={{ flexShrink: 0 }} 
        />
        <Space direction="vertical" style={{ width: "100%" }} size={8}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
            <Text strong style={{ fontSize: 16 }}>
              {review.username}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formattedDate}
            </Text>
          </Flex>
          <Rate disabled value={review.rating} allowHalf style={{ fontSize: 18 }} />
          <Paragraph style={{ margin: 0, color: "#595959" }}>
            {review.review_text}
          </Paragraph>
        </Space>
      </Flex>
    </Card>
  );
};

export default ReviewCard;
