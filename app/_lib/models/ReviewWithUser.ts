export interface ReviewWithUser {
  id: number;
  user_id: number;
  username: string;
  book_id: string;
  rating: number;
  review_text: string;
  created_at: string;
}
