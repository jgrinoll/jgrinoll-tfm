import dbConnectionPool from "@/app/_lib/db/db";
import RegisterUserDTO from "@/app/_lib/models/RegisterUserDTO";
import { validateRegisterFields } from "@/app/_lib/utils/field_validations";
import { refreshSessionIfValid } from "@/app/_lib/auth_utils";
import bcrypt from "bcrypt";
import {
  ResultSetHeader,
  RowDataPacket
} from "mysql2/promise";
import { NextResponse } from "next/server";
import "server-only";

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

export async function PATCH(req: Request) {
  let dbConnection;
  try {
    const sessionInfo = await refreshSessionIfValid();
    if (!sessionInfo) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: userId } = sessionInfo;
    const body = await req.json();
    const { username, name, bio } = body;

    if (username !== undefined && (typeof username !== 'string' || username.length > 50 || username.length === 0)) {
      return NextResponse.json(
        { ok: false, error: "Invalid username" },
        { status: 400 }
      );
    }

    if (name !== undefined && name !== null && (typeof name !== 'string' || name.length > 128)) {
      return NextResponse.json(
        { ok: false, error: "Invalid name" },
        { status: 400 }
      );
    }

    if (bio !== undefined && bio !== null && (typeof bio !== 'string' || bio.length > 512)) {
      return NextResponse.json(
        { ok: false, error: "Invalid bio" },
        { status: 400 }
      );
    }

    dbConnection = await dbConnectionPool.getConnection();

    const updateFields: string[] = [];
    const updateValues: (string | null | number)[] = [];

    if (username !== undefined) {
      updateFields.push('username = ?');
      updateValues.push(username);
    }

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name || null);
    }

    if (bio !== undefined) {
      updateFields.push('bio = ?');
      updateValues.push(bio || null);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(userId);

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await dbConnection.execute<ResultSetHeader>(query, updateValues);

    return NextResponse.json({ ok: true }, { status: 200 });
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
