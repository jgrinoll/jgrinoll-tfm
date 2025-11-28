import Paragraph from "antd/es/typography/Paragraph";
import React from "react";

interface ReviewsInfoProps {
  bookId: string;
}

const ReviewsInfo: React.FC<ReviewsInfoProps> = ({ bookId }) => {
  return <Paragraph style={{ margin: 0 }}>Sense ressenyes</Paragraph>;
};

export default ReviewsInfo;
