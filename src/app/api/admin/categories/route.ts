import { NextResponse } from "next/server";
import { getCategories } from "@/lib/categories";
import { requireSessionUser } from "@/lib/admin/auth";
import { adminErrorResponse } from "@/lib/admin/api";

export async function GET() {
  try {
    await requireSessionUser();
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
