import { NextResponse } from "next/server";
import { getProductSuggestions } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < 3) {
    return NextResponse.json([]);
  }

  const suggestions = await getProductSuggestions(query);
  return NextResponse.json(suggestions);
}
