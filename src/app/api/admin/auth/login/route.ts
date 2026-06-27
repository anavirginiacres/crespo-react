import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  setSessionCookie,
  verifyPassword,
} from "@/lib/admin/auth";
import { adminErrorResponse } from "@/lib/admin/api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };

    const username = body.username?.trim();
    const password = body.password ?? "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.adminUser.findUnique({ where: { username } });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = await createSession(user.id);
    setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
