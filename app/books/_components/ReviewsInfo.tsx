"use client";
import { Flex, Rate } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface ReviewsInfoProps {
  bookId: string;
}

interface ReviewStats {
  average_rating: number;
  review_count: number;
}

const ReviewsInfo: React.FC<ReviewsInfoProps> = ({ bookId }) => {
  const [stats, setStats] = useState<ReviewStats | undefined>();
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(`/api/book/${bookId}/review/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    };

    fetchStats();
  }, [bookId]);

  if (!stats || stats.review_count === 0) {
    return <Paragraph style={{ margin: 0 }}>Sense ressenyes</Paragraph>;
  }

  const averageRating = Number(stats.average_rating);

  return (
    <Flex
      align="center"
      justify="center"
      vertical={isMobile}
      gap={isMobile ? 4 : 8}
    >
      <Rate disabled value={averageRating} allowHalf />
      <Paragraph style={{ margin: 0, fontSize: isMobile ? 12 : 14 }}>
        {averageRating.toFixed(1)} ({stats.review_count}{" "}
        {stats.review_count === 1 ? "ressenya" : "ressenyes"})
      </Paragraph>
    </Flex>
  );
};

export default ReviewsInfo;
