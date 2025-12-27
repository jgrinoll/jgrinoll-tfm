export interface ReviewWithUser {
  id: number;
  user_id: number;
  username: string;
  avatar_url: string | null;
  book_id: string;
  rating: number;
  review_text: string;
  created_at: string;
}
