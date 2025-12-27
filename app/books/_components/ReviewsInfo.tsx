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

  const averageRating = stats ? Number(stats.average_rating) : 0;
  const reviewCount = stats?.review_count ?? 0;

  return (
    <Flex
      align="center"
      justify="center"
      vertical={isMobile}
      gap={isMobile ? 4 : 8}
    >
      <Rate disabled value={averageRating} allowHalf />
      <Paragraph
        style={{
          margin: 0,
          fontSize: isMobile ? 12 : 14,
          color: reviewCount === 0 ? "#8c8c8c" : undefined,
        }}
      >
        {reviewCount === 0
          ? "Sense ressenyes"
          : `${averageRating.toFixed(1)} (${reviewCount} ${reviewCount === 1 ? "ressenya" : "ressenyes"})`}
      </Paragraph>
    </Flex>
  );
};

export default ReviewsInfo;
