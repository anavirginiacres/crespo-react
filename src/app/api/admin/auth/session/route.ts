import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  clearSessionCookie,
  deleteSession,
  getCurrentSessionUser,
} from "@/lib/admin/auth";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin/types";
import { adminErrorResponse } from "@/lib/admin/api";

export async function GET() {
  try {
    const user = await getCurrentSessionUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function DELETE() {
  try {
    const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;

    if (token) {
      await deleteSession(token);
    }

    clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
