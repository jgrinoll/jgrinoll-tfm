import "server-only";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import CategoryCard from "./CategoryCard";
import styles from "./CategoriesSection.module.css";

interface CategoryOption {
  label: string;
  value: string;
  thumbnail: string;
}
const CategoriesSection = () => {
  // TODO - Get thumbnails from a quick google books search
  const categories: CategoryOption[] = [
    {
      label: "Fantasia",
      value: "Fantasia",
      thumbnail:
        "https://books.google.com/books/publisher/content?id=8w-YCgAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&imgtk=AFLRE70XxMCWMuWQl2OuFlJnS3utsrU-LlEOd-PVtJ18E7JY4GURg1bLWNTuYFM6KGqkurJLTXwE4gVKUkyNuhgeXqXMzwRAB4A1nxQmw9RdOCgCq-2WetZ_sSCoT4u03xbb_kYMPmI9&source=gbs_api",
    },
    {
      label: "Ciencia Ficció",
      value: "Ciència Ficció",
      thumbnail:
        "https://books.google.com/books/publisher/content?id=uUDYEAAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&imgtk=AFLRE71wazbJt1mt9l68dV2uUMkiM7Xeng7BSzcHNQrmTKt1iYackAl4wh2OUPlId3MIWuNvZyBdEHVV0D1k__H0ZDVqP-bxtPQfLCHpdwE6mXQmE4eYr4NFdb2cQACpw3ze3EOdgPkl&source=gbs_api",
    },
    {
      label: "Manga",
      value: "Manga",
      thumbnail:
        "https://books.google.com/books/publisher/content?id=j1KMEAAAQBAJ&printsec=frontcover&img=1&zoom=5&imgtk=AFLRE71h6af6aHHNKtoXJ-GUYBC4E16yD9_yqTJORV3wCP0OooTjYB5QgmOFXhRToUksTsvROV2ucR7Ufgc31pn_pa5iTb4dULq7lM8Xvd1bxUX2-UjfmlfBKDShK4ViUXygiDvikhUK&source=gbs_api",
    },
    {
      label: "Ficció",
      value: "Ficció",
      thumbnail:
        "https://books.google.com/books/publisher/content?id=VU1PEQAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&imgtk=AFLRE71vWIYhxqEmxWyIU51X0xNoMtnuy-aHaX_qRytpNp59YNE2OTlgqTvwNP0PuWkp3nf7xqedzyxPlxZ4dlZBRoern1nnPEdh8jkFVfx7BuUdVznRUNmeK3nzPGOAL-sJn6j4mrgU&source=gbs_api",
    },
    {
      label: "Ciència",
      value: "Ciència",
      thumbnail:
        "https://books.google.com/books/publisher/content?id=xpk2EQAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&imgtk=AFLRE72g7IkVGOZHlvtC6VlXTynnDSm5hIqNXuEdIH9x0bivYfNLrANO0vD7VaMARg-yK2nfRNpmvKQl81xgkvIbH6xu7--QLClxQMvDTpfxBVorVNUGg7tufo08aeubgm4gIbumzvrB&source=gbs_api",
    },
  ];
  return (
    <section style={{ backgroundColor: "#fdf6f0" }}>
      <Title level={1}>Categories</Title>
      <Paragraph>Explora les categories més populars</Paragraph>
      <ul className={styles["categories-list"]}>
        {categories.map(({ value, label, thumbnail }) => {
          const searchParams = new URLSearchParams({ subject: value });
          return (
            <li key={value}>
              <Link href={`/books/${searchParams.toString()}`}>
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
