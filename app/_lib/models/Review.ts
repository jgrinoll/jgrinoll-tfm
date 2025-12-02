export interface Review {
  id: number;
  user_id: number;
  book_id: string;
  rating: number;
  review_text: string;
  created_at: string;
}
