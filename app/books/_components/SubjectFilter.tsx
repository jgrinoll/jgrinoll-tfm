"use client";
import { CATEGORIES } from "@/app/_lib/utils/category_utils";
import { Tag } from "antd";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface SubjectFilterProps {
  subject?: string;
  searchQuery?: string;
  minRating?: number;
}

const SubjectFilter: React.FC<SubjectFilterProps> = ({
  subject,
  searchQuery,
  minRating,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!subject) {
    return null;
  }

  const category = CATEGORIES.find((cat) => cat.value === subject);
  const label = category ? category.label : subject;

  const handleRemove = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (minRating) params.set("minRating", minRating.toString());

      const url = params.toString() ? `/books?${params.toString()}` : "/books";
      router.push(url);
    });
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Tag 
        closable 
        onClose={handleRemove} 
        color="blue"
        style={{ opacity: isPending ? 0.6 : 1 }}
      >
        <strong>Categoria:</strong> {label}
      </Tag>
    </div>
  );
};

export default SubjectFilter;
