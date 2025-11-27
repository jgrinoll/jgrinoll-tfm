"use server";
import "server-only";
import {
  createConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import { GetDBSettings } from "../_db/DBSettings";
import RegisterUserDTO from "../_models/RegisterUserDTO";
import bcrypt from "bcrypt";
import LoginUserDTO from "../_models/LoginUserDTO";
import { jwtVerify, SignJWT } from "jose";
import SessionPayload from "../_models/SessionPayload";
import { cookies } from "next/headers";

type MySQLError = {
  code: string;
  errno: number;
  sql: string;
  sqlState: string;
  sqlMessage: string;
};

const validateEmail = (email: string) =>
  !!email &&
  /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/.test(email) &&
  email.length <= 100;
const validateUsername = (username: string) =>
  !!username && username.length <= 50;
const validatePassword = (password: string) =>
  !!password && password.length <= 30 && password.length > 8;

const validateRegisterFields = (user: RegisterUserDTO): boolean => {
  return (
    validateEmail(user.email) &&
    validateUsername(user.username) &&
    validatePassword(user.plainPassword)
  );
};
const validateLoginFields = (user: LoginUserDTO): boolean => {
  return validateEmail(user.email) && validatePassword(user.plainPassword);
};

export async function register(
  user: RegisterUserDTO
): Promise<{ rowsAffected: number; errorMsg?: string }> {
  if (!validateRegisterFields(user)) {
    return { rowsAffected: 0, errorMsg: `The values are invalid.` };
  }

  // Hash the password using bcrypt
  const hashPassword = bcrypt.hashSync(user.plainPassword, 10);

  const dbConnection = await createConnection(GetDBSettings());

  const sql = "INSERT INTO users (email, username, password) VALUES (?,?,?)";
  const values = [user.email, user.username, hashPassword];

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

export async function login(
  user: LoginUserDTO
): Promise<false | { username: string; id: number }> {
  if (!validateLoginFields(user)) {
    return false;
  }

  const dbConnection = await createConnection(GetDBSettings());

  const sql = "SELECT id, username, password FROM users WHERE email = ?";
  const values = [user.email];

  try {
    const [results] = await dbConnection.execute<RowDataPacket[]>(sql, values);

    if (results.length === 0) {
      return false;
    }

    const userData = results[0];
    const hashedPassword = userData.password;

    const passwordValid = bcrypt.compareSync(
      user.plainPassword,
      hashedPassword
    );

    if (!passwordValid) return false;

    // The login is valid, we prepare the JWT.
    createSession(userData.id);

    return { username: userData.username, id: userData.id };
  } catch (err) {
    console.error(err);

    // We do not return a detailed error message for security reasons.
    return false;
  }
}

const secretKey = process.env.JWT_PRIVATE_KEY;
const encodedKey = new TextEncoder().encode(secretKey);
async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(encodedKey);
}

async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Failed to verify session");
  }
}

export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt(payload);
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = getSessionInfo();

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7200); // 2h

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSessionInfo() {
  const session = (await cookies()).get("session")?.value;
  return (await decrypt(session)) as SessionPayload;
}
