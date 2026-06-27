import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE_DAYS,
  type SessionUser,
} from "@/lib/admin/types";

const BCRYPT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getSessionExpiryDate(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_MAX_AGE_DAYS);
  return expiresAt;
}

export async function createSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  await prisma.adminSession.create({
    data: {
      token: tokenHash,
      userId,
      expiresAt: getSessionExpiryDate(),
    },
  });

  return token;
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.adminSession.deleteMany({
    where: { token: hashToken(token) },
  });
}

export async function getSessionUser(
  token?: string | null
): Promise<SessionUser | null> {
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { token: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.adminSession.delete({ where: { id: session.id } });
    }
    return null;
  }

  return {
    id: session.user.id,
    username: session.user.username,
    role: session.user.role as SessionUser["role"],
  };
}

export async function getCurrentSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  return getSessionUser(token);
}

export function setSessionCookie(token: string): void {
  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
  });
}

export function clearSessionCookie(): void {
  cookies().delete(ADMIN_SESSION_COOKIE);
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getCurrentSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdminUser(): Promise<SessionUser> {
  const user = await requireSessionUser();
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
