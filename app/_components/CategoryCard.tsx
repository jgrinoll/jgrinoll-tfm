import { Card } from "antd";
import BookCover from "../books/_components/BookCover";
import Paragraph from "antd/es/typography/Paragraph";

interface CategoryCardProps {
  thumbnail: string;
  name: string;
}
const CategoryCard: React.FC<CategoryCardProps> = ({ thumbnail, name }) => {
  return (
    <Card style={{ backgroundColor: "#fbcfe8" }}>
      <div style={{ height: "25vh" }}>
        <BookCover preview={false} src={thumbnail} />
      </div>
      <Paragraph
        strong
        style={{ textAlign: "center", width: "100%", margin: 0 }}
      >
        {name}
      </Paragraph>
    </Card>
  );
};

export default CategoryCard;
