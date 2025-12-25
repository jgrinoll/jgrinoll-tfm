"use client";
import { Select } from "antd";
import { CATEGORIES } from "@/app/_lib/utils/category_utils";
import { useRouter } from "next/navigation";

interface CategorySelectorProps {
  subject?: string;
  searchQuery?: string;
  minRating?: number;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  subject,
  searchQuery,
  minRating,
}) => {
  const router = useRouter();

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (minRating) params.set("minRating", minRating.toString());
    if (value) params.set("subject", value);

    const url = params.toString() ? `/books?${params.toString()}` : "/books";
    router.push(url);
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <span style={{ marginRight: "0.5rem" }}>Categoria:</span>
      <Select
        value={subject || ""}
        onChange={handleCategoryChange}
        style={{ minWidth: "200px" }}
      >
        <Select.Option value="">Totes les categories</Select.Option>
        {CATEGORIES.map((category) => (
          <Select.Option key={category.value} value={category.value}>
            {category.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default CategorySelector;
