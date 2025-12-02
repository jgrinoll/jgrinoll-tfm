"use client";
import { GoogleBook, ImageLinks } from "@/app/_lib/models/GoogleBook";
import { Image, message } from "antd";
import SkeletonImage from "antd/es/skeleton/Image";
import React, { useEffect, useState } from "react";

interface BookCoverProps {
  src?: string;
  imageLinks?: ImageLinks;
  bookId?: string;
  size?: "default" | "largest";
  preview?: boolean;
}
const BookCover: React.FC<BookCoverProps> = ({
  imageLinks: imageLinksProp,
  size = "default",
  bookId,
  preview = true,
  src: srcProp,
}) => {
  const [loading, setLoading] = useState(size === "largest");
  const [imageLinks, setImageLinks] = useState(imageLinksProp);
  const [src, setSrc] = useState<string | null>(
    srcProp ?? imageLinks?.thumbnail ?? null
  ); // We first load the thumbnail size image for a faster first load.

  useEffect(() => {
    const fetchGoogleBook = async () => {
      const response = await fetch(`api/google_books/${bookId}`);

      if (!response.ok) {
        message.error(`Error obtenint els detalls del llibre ${bookId}`);
      }

      const googleBook: GoogleBook = await response.json();
      setImageLinks(googleBook.volumeInfo.imageLinks);
      setSrc(srcProp ?? googleBook.volumeInfo.imageLinks?.thumbnail ?? null);
    };

    if (bookId) {
      fetchGoogleBook();
    }
  }, [bookId, setImageLinks, srcProp]);

  useEffect(() => {
    const getAvailableLargestSize = async () => {
      setLoading(true);

      try {
        const resp = await fetch("/api/google_books/available_thumbnail", {
          method: "POST",
          body: JSON.stringify(imageLinks),
        });

        if (resp.ok) {
          const body = await resp.json();
          setSrc(body);
        }
      } catch (err) {
        message.error(
          `Hi ha hagut un error comprovant les dades del llibre a les llistes de l'usuari: ${err}`
        );
      } finally {
        setLoading(false);
      }
    };

    if (imageLinks && size === "largest") {
      // TODO - Maybe get url from our caché if available to reduce load time.
      getAvailableLargestSize();
    }
  }, [imageLinks, size]);

  if (!src) {
    return null;
  }

  // TODO - Will need a placeholder image if the book doesn't even have "imageLinks"
  return (
    <>
      {loading && <SkeletonImage active={loading} />}
      {!loading && preview && (
        <Image
          src={src ?? undefined}
          style={{
            borderTopRightRadius: "1rem",
            borderBottomRightRadius: "1rem",
            padding: 5,
            height: "100%", // Take parent size
            width: "100%",
          }}
          alt="Book cover"
          preview={preview}
        />
      )}
      {!loading && !preview && (
        <img
          src={src ?? undefined}
          style={{
            borderTopRightRadius: "1rem",
            borderBottomRightRadius: "1rem",
            padding: 5,
            height: "100%",
            width: "100%",
            objectFit: "contain",
          }}
          alt="Book cover"
        />
      )}
    </>
  );
};

export default BookCover;
