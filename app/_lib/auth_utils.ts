import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import SessionPayload from "./models/SessionPayload";
import { getUserData } from "../_actions/user_actions";
import UserDTO from "./models/UserDTO";

export async function getSessionInfo() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return (await decrypt(session)) as SessionPayload;
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
  } catch (_) {
    console.error("Failed to verify session");
  }
}

export async function getCurrentUser(): Promise<UserDTO | null> {
  const session = await getSessionInfo();
  if (!session) return null;
  return await getUserData(session.id);
}
