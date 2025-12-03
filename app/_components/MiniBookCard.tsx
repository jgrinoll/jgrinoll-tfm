import { Card } from "antd";
import BookCover from "../books/_components/BookCover";
import Paragraph from "antd/es/typography/Paragraph";
import styles from "./MiniBookCard.module.css";
import { getShortTitle } from "../_lib/utils/book_utils";

interface RelatedBookCardProps {
  thumbnail?: string;
  title: string;
}

const MiniBookCard: React.FC<RelatedBookCardProps> = ({ thumbnail, title }) => {
  return (
    <>
      <div className={styles.imageContainer}>
        {thumbnail && <BookCover preview={false} src={thumbnail} />}
      </div>
      <Paragraph
        strong
        style={{
          textAlign: "center",
          width: "100%",
          margin: 0,
          textWrap: "wrap",
          maxWidth: "200px",
        }}
      >
        {getShortTitle(title)}
      </Paragraph>
    </>
    /* </Card> */
  );
};

export default MiniBookCard;
