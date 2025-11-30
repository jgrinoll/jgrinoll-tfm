import { ImageLinks } from "@/app/_lib/models/Book";
import { Image } from "antd";
import SkeletonImage from "antd/es/skeleton/Image";
import React, { useEffect, useState } from "react";

interface BookCoverProps {
  imageLinks: ImageLinks;
  size?: "default" | "largest";
}
const BookCover: React.FC<BookCoverProps> = ({
  imageLinks,
  size = "default",
}) => {
  const [loading, setLoading] = useState(size === "largest");
  const [src, setSrc] = useState<string | null>(imageLinks.thumbnail ?? null); // We first load the thumbnail size image for a faster first load.

  useEffect(() => {
    const getAvailableLargestSize = async () => {
      setLoading(true);
      const resp = await fetch("/api/google_books/available_thumbnail", {
        method: "POST",
        body: JSON.stringify(imageLinks),
      });

      console.log("Available thumbnail response is: ", resp);

      if (resp.ok) {
        const body = await resp.json();
        console.log("Available thumbnail is: ", body);
        setSrc(body);
      }
      setLoading(false);
    };

    if (size === "largest") {
      // TODO - Maybe get url from our caché if available to reduce load time.
      getAvailableLargestSize();
    }
  }, [imageLinks, size]);

  if (!imageLinks) {
    return null;
  }

  // TODO - Will need a placeholder image if the book doesn't even have "imageLinks"
  return (
    <>
      {loading && <SkeletonImage active={loading} />}
      {!loading && (
        <Image
          src={src ?? undefined}
          style={{
            borderTopRightRadius: "1rem",
            borderBottomRightRadius: "1rem",
            padding: 5,
            maxHeight: "500px",
          }}
          alt="Book cover"
        />
      )}
    </>
  );
};

export default BookCover;
