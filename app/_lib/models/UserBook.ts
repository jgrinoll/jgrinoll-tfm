import { Dayjs } from "dayjs";
import List from "./ListsEnum";

export interface UserBook {
  id: number;
  user_id: number;
  book_id: string;
  status: List;
  created_at: Dayjs;
  updated_at: Dayjs;
}
