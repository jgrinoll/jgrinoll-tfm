"use client";
import { ReviewWithUser } from "@/app/_lib/models/ReviewWithUser";
import { Flex, Space } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";

interface ReviewListProps {
  bookId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ bookId }) => {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(`/api/book/${bookId}/review/list`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    };

    fetchReviews();
  }, [bookId]);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <Space vertical style={{ width: "100%", padding: "24px 0" }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        Ressenyes
      </Title>
      <Flex vertical gap={0}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </Flex>
    </Space>
  );
};

export default ReviewList;
