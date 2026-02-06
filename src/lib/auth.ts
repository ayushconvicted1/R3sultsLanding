import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "r3sults-jwt-secret-change-in-production";
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "7d";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface JWTPayload {
  sub: string; // user email
  email: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.email)
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const sub = payload.sub as string;
    const email = (payload.email as string) || sub;
    const firstName = (payload.firstName as string) || "";
    const lastName = (payload.lastName as string) || "";
    return { sub, email, firstName, lastName, iat: payload.iat as number, exp: payload.exp as number };
  } catch {
    return null;
  }
}
