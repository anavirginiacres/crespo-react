import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "img", "productos");
const PUBLIC_PREFIX = "/img/productos";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 10;

export type UploadableImage = {
  name: string;
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
};

function sanitizeFilename(name: string): string {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "imagen";
}

function resolveExtension(file: UploadableImage): string {
  const fromName = path.extname(file.name).toLowerCase();
  if (ALLOWED_EXTENSIONS.has(fromName)) return fromName;

  switch (file.type) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".jpg";
  }
}

function buildUniqueFilename(file: UploadableImage): string {
  const extension = resolveExtension(file);
  const base = sanitizeFilename(path.basename(file.name, path.extname(file.name)));
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${base}-${suffix}${extension}`;
}

function validateImageFile(file: UploadableImage): string | null {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return `Tipo de archivo no permitido: ${file.name}`;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `El archivo supera 5 MB: ${file.name}`;
  }

  return null;
}

export function isUploadableImage(
  entry: FormDataEntryValue
): entry is Exclude<FormDataEntryValue, string> {
  return typeof entry !== "string" && entry.size > 0;
}

export function toUploadableImage(blob: Blob, index: number): UploadableImage {
  const fileName =
    "name" in blob && typeof blob.name === "string" && blob.name.trim()
      ? blob.name
      : `imagen-${index + 1}.jpg`;

  return {
    name: fileName,
    type: blob.type || "image/jpeg",
    size: blob.size,
    arrayBuffer: () => blob.arrayBuffer(),
  };
}

export async function saveProductImages(files: UploadableImage[]): Promise<string[]> {
  if (files.length === 0) return [];

  if (files.length > MAX_FILES) {
    throw new Error(`Podés subir hasta ${MAX_FILES} imágenes por vez.`);
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const paths: string[] = [];

  for (const file of files) {
    const validationError = validateImageFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    const filename = buildUniqueFilename(file);
    const absolutePath = path.join(UPLOAD_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(absolutePath, buffer);
    paths.push(`${PUBLIC_PREFIX}/${filename}`);
  }

  return paths;
}
