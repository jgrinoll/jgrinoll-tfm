import "server-only";
import { NextResponse } from "next/server";
import { createConnection, RowDataPacket } from "mysql2/promise";
import { GetDBSettings } from "@/app/_lib/db/DBSettings";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import UserDTO from "@/app/lib/models/UserDTO";

export async function POST(req: Request) {
  try {
    const { email, plainPassword } = await req.json();

    if (!email || !plainPassword) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }

    const db = await createConnection(GetDBSettings());
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT id, username, password, avatar_url, level, total_pages_read FROM users WHERE email = ?",
      [email]
    );

    await db.end();

    if (!rows.length) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const hashedPassword = rows[0].password;
    const user = rows[0] as UserDTO;
    const valid = await bcrypt.compare(plainPassword, hashedPassword);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_PRIVATE_KEY || "");
    const token = await new SignJWT({ id: user.id, username: user.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    const res = NextResponse.json(user);
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  // return an empty JSON response and delete the session cookie
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("session");
  return res;
}
