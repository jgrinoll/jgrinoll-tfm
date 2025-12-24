"use client";
import { CATEGORIES } from "@/app/_lib/utils/category_utils";
import { Tag } from "antd";
import { useRouter } from "next/navigation";

interface SubjectFilterProps {
  subject?: string;
  searchQuery?: string;
}

const SubjectFilter: React.FC<SubjectFilterProps> = ({
  subject,
  searchQuery,
}) => {
  const router = useRouter();

  if (!subject) {
    return null;
  }

  const category = CATEGORIES.find((cat) => cat.value === subject);
  const label = category ? category.label : subject;

  const handleRemove = () => {
    if (searchQuery) {
      router.push(`/books?q=${searchQuery}`);
    } else {
      router.push("/books");
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Tag closable onClose={handleRemove} color="blue">
        <strong>Categoria:</strong> {label}
      </Tag>
    </div>
  );
};

export default SubjectFilter;
