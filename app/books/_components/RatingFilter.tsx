"use client";
import { Flex, Rate, Tag } from "antd";
import { useRouter } from "next/navigation";

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

  const handleRatingChange = (value: number) => {
    if (value === 0) {
      handleRemove();
      return;
    }

    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (subject) params.set("subject", subject);
    params.set("minRating", value.toString());

    router.push(`/books?${params.toString()}`);
  };

  const handleRemove = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (subject) params.set("subject", subject);

    const url = params.toString() ? `/books?${params.toString()}` : "/books";
    router.push(url);
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Flex gap={8} wrap="wrap" align="center">
        <span>Puntuació mínima:</span>
        <Rate
          value={minRating || 0}
          onChange={handleRatingChange}
          allowClear
        />
        {minRating && (
          <Tag closable onClose={handleRemove} color="orange">
            <strong>Puntuació:</strong> {minRating}+ estrelles
          </Tag>
        )}
      </Flex>
    </div>
  );
};

export default RatingFilter;
