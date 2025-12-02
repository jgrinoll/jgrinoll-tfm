import { RowDataPacket } from "mysql2/promise";
import "server-only";
import dbConnectionPool from "../_lib/db/db";
import UserDTO from "../_lib/models/UserDTO";

export const getUserData = async (user_id: number): Promise<UserDTO | null> => {
  const dbConnection = await dbConnectionPool.getConnection();
  const sql =
    "SELECT id, username, email, avatar_url, created_at, updated_at, level, total_pages_read FROM users WHERE id = ?";
  const values = [user_id];

  try {
    const [results] = await dbConnection.query<RowDataPacket[]>(sql, values);

    if (results.length === 0) {
      return null;
    }

    return results[0] as UserDTO;
  } catch (err) {
    console.error(err);

    // We do not return a detailed error message for security reasons.
    return null;
  } finally {
    dbConnection.release();
  }
};
