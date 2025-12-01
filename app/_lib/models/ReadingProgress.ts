export interface ReadingProgress {
  id: number;
  user_id: number;
  book_id: string;
  pages_read: number;
  percentage?: number;
}
