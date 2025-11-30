export default interface Book {
  id: string;
  title: string;
  authors: string;
  thumbnail: string;
  page_count?: number;
  categories?: string;
  description?: string;
}
