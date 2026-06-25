import { NextResponse } from "next/server";
import { requireSessionUser } from "@/lib/admin/auth";
import { adminErrorResponse } from "@/lib/admin/api";
import {
  isUploadableImage,
  saveProductImages,
  toUploadableImage,
} from "@/lib/admin/productImageUpload";

export async function POST(request: Request) {
  try {
    await requireSessionUser();

    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter(isUploadableImage)
      .map((entry, index) => toUploadableImage(entry, index));

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No se recibieron archivos de imagen" },
        { status: 400 }
      );
    }

    const paths = await saveProductImages(files);

    return NextResponse.json({ paths });
  } catch (error) {
    if (error instanceof Error && error.message) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return adminErrorResponse(error);
  }
}
