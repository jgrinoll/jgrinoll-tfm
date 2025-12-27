"use client";
import { Flex, Rate, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface RatingFilterProps {
  minRating?: number;
  searchQuery?: string;
  subject?: string;
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  minRating,
  searchQuery,
  subject,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRatingChange = (value: number) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (subject) params.set("subject", subject);
      if (value > 0) params.set("minRating", value.toString());

      const url = params.toString() ? `/books?${params.toString()}` : "/books";
      router.push(url);
    });
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Flex gap={8} wrap="wrap" align="center">
        <span>Puntuació mínima:</span>
        <Spin spinning={isPending} size="small">
          <Rate
            value={minRating || 0}
            onChange={handleRatingChange}
            allowClear
            disabled={isPending}
          />
        </Spin>
      </Flex>
    </div>
  );
};

export default RatingFilter;
