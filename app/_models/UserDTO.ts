import { Dayjs } from "dayjs";

export default interface UserDTO {
  id: number | undefined; // Is undefined is user is not present in the database yet
  username: string;
  email: string;
  // We don't add password here to make sure no hashed password ever gets to the client side
  avatar_url: string | undefined;
  created_at: Dayjs | undefined;
  updated_at: Dayjs | undefined;
  level: number | undefined;
  total_pages_read: number | undefined;
}
