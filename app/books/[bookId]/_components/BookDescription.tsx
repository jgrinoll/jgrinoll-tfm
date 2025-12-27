"use client";

import Paragraph from "antd/es/typography/Paragraph";
import Parser from "html-react-parser";
import React, { useEffect, useRef, useState } from "react";

interface BookDescriptionProps {
  description: string;
}

const BookDescription: React.FC<BookDescriptionProps> = ({ description }) => {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [isExpandable, setIsExpandable] = useState(false);
  const MAX_ROWS = 9;

  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * MAX_ROWS;
      const actualHeight = element.scrollHeight;
      
      setIsExpandable(actualHeight > maxHeight);
    }
  }, [description]);

  return (
    <div ref={descriptionRef}>
      <Paragraph
        ellipsis={
          isExpandable
            ? {
                rows: MAX_ROWS,
                expandable: "collapsible",
                defaultExpanded: false,
                symbol: (expanded) => (expanded ? "Amagar" : "Mostrar més"),
              }
            : false
        }
      >
        {Parser(description ?? "<b>Sense descripció</b>")}
      </Paragraph>
    </div>
  );
};

export default BookDescription;
