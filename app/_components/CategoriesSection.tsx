import "server-only";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import CategoryCard from "./CategoryCard";
import styles from "./CategoriesSection.module.css";
import { getCategoriesWithThumbnails } from "../api/categories/route";

const CategoriesSection = async () => {
  const categories = await getCategoriesWithThumbnails();

  return (
    <section style={{ backgroundColor: "#fdf6f0" }}>
      <Title level={1}>Categories</Title>
      <Paragraph>Explora les categories més populars</Paragraph>
      <ul className={styles["categories-list"]}>
        {categories.map(({ value, label, thumbnail }) => {
          return (
            <li key={value}>
              <Link href={`/books?subject=${value}`}>
                <CategoryCard thumbnail={thumbnail} name={label} />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CategoriesSection;
