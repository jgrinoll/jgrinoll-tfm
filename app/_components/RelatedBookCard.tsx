import { Card } from "antd";
import BookCover from "../books/_components/BookCover";
import Paragraph from "antd/es/typography/Paragraph";
import styles from "./RelatedBookCard.module.css";

interface RelatedBookCardProps {
  thumbnail?: string;
  title: string;
}

const RelatedBookCard: React.FC<RelatedBookCardProps> = ({
  thumbnail,
  title,
}) => {
  return (
    <Card style={{ 
      backgroundColor: "#fbcfe8", 
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
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
          maxWidth: "200px"
        }}
      >
        {title}
      </Paragraph>
    </Card>
  );
};

export default RelatedBookCard;
