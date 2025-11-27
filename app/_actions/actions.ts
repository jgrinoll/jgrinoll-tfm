"use server";

import { createConnection, ResultSetHeader } from "mysql2/promise";
import { GetDBSettings } from "../_db/DBSettings";
import RegisterUserDTO from "../_models/RegisterUserDTO";

type MySQLError = {
  code: string;
  errno: number;
  sql: string;
  sqlState: string;
  sqlMessage: string;
};

const validateRegisterFields = ({
  email,
  username,
  plainPassword,
}: RegisterUserDTO): boolean => {
  // Email validations
  if (
    !email ||
    !/[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/.test(email) ||
    email.length > 100
  )
    return false;

  // Username validations
  if (!username || username.length > 50) return false;

  // Password validations
  if (!plainPassword || plainPassword.length < 8 || plainPassword.length > 30)
    return false;

  return true;
};

export async function registerUser(
  user: RegisterUserDTO
): Promise<{ rowsAffected: number; errorMsg?: string }> {
  if (!validateRegisterFields(user)) {
    return { rowsAffected: 0, errorMsg: `The values are invalid.` };
  }

  const dbConnection = await createConnection(GetDBSettings());

  const sql = "INSERT INTO users (email, username, password) VALUES (?,?,?)";
  const values = [user.email, user.username, user.plainPassword];

  try {
    const [result] = await dbConnection.execute<ResultSetHeader>(sql, values);
    return { rowsAffected: result.affectedRows };
  } catch (err) {
    const sqlError = err as MySQLError;
    switch (sqlError.code) {
      case "ER_DUP_ENTRY":
        return {
          rowsAffected: 0,
          errorMsg: "This email is already registered.",
        };
      default:
        return {
          rowsAffected: 0,
          errorMsg: "Unexpected error while registering user.",
        };
    }
  }
}
