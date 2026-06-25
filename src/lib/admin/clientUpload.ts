export async function uploadProductImages(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as {
    paths?: string[];
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "No se pudieron subir las imágenes");
  }

  return data.paths ?? [];
}
