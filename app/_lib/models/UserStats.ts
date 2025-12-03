export interface BookStatInfo {
  book_id: string;
  title: string;
  authors: string;
  thumbnail: string;
  page_count: number;
  avg_rating?: number;
}

export interface AuthorStatInfo {
  authors: string;
  book_count: number;
  book_id: string;
  title: string;
  thumbnail: string;
}

export interface UserStats {
  highestRatedBook: BookStatInfo | null;
  longestBook: BookStatInfo | null;
  mostReadAuthor: AuthorStatInfo | null;
  totalBooksRead: number;
  totalPagesRead: number;
  avgRating: number;
}
