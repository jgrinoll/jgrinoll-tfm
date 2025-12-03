import { Connection, PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import "server-only";
import dbConnectionPool from "../_lib/db/db";
import UserDTO from "../_lib/models/UserDTO";
import { calculateLevelFromPages } from "../_lib/utils/leveling_utils";

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

export interface UpdatePagesReadResult {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  totalPages: number;
}

export const updateUserPagesAndLevel = async (
  userId: number,
  pagesToAdd: number,
  connection?: PoolConnection
): Promise<UpdatePagesReadResult | null> => {
  const shouldReleaseConnection = !connection;
  const dbConnection = connection || (await dbConnectionPool.getConnection());

  try {
    const [userResults] = await dbConnection.query<RowDataPacket[]>(
      "SELECT level, total_pages_read FROM users WHERE id = ?",
      [userId]
    );

    if (userResults.length === 0) {
      return null;
    }

    const oldLevel = userResults[0].level as number;
    const oldTotalPages = userResults[0].total_pages_read as number;
    const newTotalPages = oldTotalPages + pagesToAdd;
    const newLevel = calculateLevelFromPages(newTotalPages);

    await dbConnection.execute<ResultSetHeader>(
      "UPDATE users SET total_pages_read = ?, level = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [newTotalPages, newLevel, userId]
    );

    return {
      leveledUp: newLevel > oldLevel,
      oldLevel,
      newLevel,
      totalPages: newTotalPages,
    };
  } catch (err) {
    console.error("Error updating user pages and level:", err);
    return null;
  } finally {
    if (shouldReleaseConnection) {
      dbConnection.release();
    }
  }
};
