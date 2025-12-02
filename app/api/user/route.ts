import dbConnectionPool from "@/app/_lib/db/db";
import RegisterUserDTO from "@/app/_lib/models/RegisterUserDTO";
import { validateRegisterFields } from "@/app/_lib/utils/field_validations";
import bcrypt from "bcrypt";
import {
  ResultSetHeader,
  RowDataPacket
} from "mysql2/promise";
import { NextResponse } from "next/server";
import "server-only";

type MySQLError = {
  code: string;
  errno: number;
  sql: string;
  sqlState: string;
  sqlMessage: string;
};

export async function POST(req: Request) {
  let dbConnection;
  try {
    const user: RegisterUserDTO = await req.json();

    if (!validateRegisterFields(user)) {
      return NextResponse.json(
        { ok: false, error: "Invalid fields" },
        { status: 400 }
      );
    }

    dbConnection = await dbConnectionPool.getConnection();

    // Duplicate email check
    const [existing] = await dbConnection.execute<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [user.email]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    // Insert user
    // Hash the password using bcrypt
    const hashPassword = bcrypt.hashSync(user.plainPassword, 10);
    const [result] = await dbConnection.execute<ResultSetHeader>(
      "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
      [user.email, user.username, hashPassword]
    );

    return NextResponse.json(
      { ok: true, id: result.insertId },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (dbConnection) dbConnection.release();
  }
}

export async function DELETE(req: Request) {
  // return an empty JSON response and delete the session cookie
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("session");
  return res;
}
