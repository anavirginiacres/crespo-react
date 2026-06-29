
import { FormEvent, useEffect, useMemo, useState } from "react";
import { uploadProductImages } from "@/lib/admin/clientUpload";
import type { SessionUser } from "@/lib/admin/types";
import styles from "./Admin.module.scss";

type CategoryOption = {
  id: number;
  name: string;
  subcategories: { id: number; name: string }[];
};

type ProductRecord = {
  id: number;
  name: string;
  caption: string | null;
  image: string | null;
  materials: string | null;
  measures: string | null;
  quantity: string | null;
  details: string | null;
  caution: string | null;
  colors: string | null;
  delay: string | null;
  tags: string | null;
  new_product: boolean;
  id_category: number;
  id_subcategory: number;
  images: { id: number; src: string }[];
};

type ProductEditorProps = {
  user: SessionUser;
  product?: ProductRecord | null;
  onSaved: (message: string) => void;
};

const emptyForm = {
  id_category: "",
  id_subcategory: "",
  name: "",
  caption: "",
  image: "",
  materials: "",
  measures: "",
  quantity: "",
  details: "",
  caution: "",
  colors: "",
  delay: "",
  tags: "",
  new_product: false,
};

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export default function ProductEditor({
  user,
  product,
  onSaved,
}: ProductEditorProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [editGalleryFiles, setEditGalleryFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((response) => response.json())
      .then((data: { categories: CategoryOption[] }) => {
        setCategories(data.categories);
      })
      .catch(() => setError("No se pudieron cargar las categorías"));
  }, []);

  useEffect(() => {
    if (!product) {
      setForm(emptyForm);
      setMainImageFile(null);
      setMainImagePreview("");
      setGalleryFiles([]);
      return;
    }

    setForm({
      id_category: String(product.id_category),
      id_subcategory: String(product.id_subcategory),
      name: product.name,
      caption: product.caption ?? "",
      image: product.image ?? "",
      materials: product.materials ?? "",
      measures: product.measures ?? "",
      quantity: product.quantity ?? "",
      details: product.details ?? "",
      caution: product.caution ?? "",
      colors: product.colors ?? "",
      delay: product.delay ?? "",
      tags: product.tags ?? "",
      new_product: product.new_product,
    });
    setMainImageFile(null);
    setMainImagePreview(product.image ?? "");
    setGalleryFiles([]);
    setEditGalleryFiles([]);
  }, [product]);

  useEffect(() => {
    if (!mainImageFile) {
      if (!product?.image) setMainImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(mainImageFile);
    setMainImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [mainImageFile, product?.image]);

  const subcategories = useMemo(() => {
    const categoryId = Number(form.id_category);
    return (
      categories.find((category) => category.id === categoryId)?.subcategories ??
      []
    );
  }, [categories, form.id_category]);

  function resetFileInputs() {
    setMainImageFile(null);
    setMainImagePreview("");
    setGalleryFiles([]);
    setEditGalleryFiles([]);
    setFileInputKey((key) => key + 1);
  }

  async function submitChange(
    action: "CREATE_PRODUCT" | "UPDATE_PRODUCT" | "ADD_IMAGE" | "DELETE_IMAGE",
    payload: unknown,
    productId?: number | null
  ) {
    const response = await fetch("/api/admin/changes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, productId: productId ?? null, payload }),
    });

    const data = (await response.json()) as {
      error?: string;
      mode?: "applied" | "pending";
    };

    if (!response.ok) {
      throw new Error(data.error ?? "No se pudo guardar el cambio");
    }

    return data.mode ?? "pending";
  }

  async function resolveMainImagePath(): Promise<string | null> {
    if (mainImageFile) {
      const paths = await uploadProductImages([mainImageFile]);
      return paths[0] ?? null;
    }

    return form.image.trim() || null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const idCategory = Number(form.id_category);
      const idSubcategory = Number(form.id_subcategory);

      if (!form.name.trim() || !idCategory || !idSubcategory) {
        setError("Nombre, categoría y subcategoría son obligatorios");
        return;
      }

      const imagePath = await resolveMainImagePath();
      let galleryPaths: string[] = [];

      if (!product && galleryFiles.length > 0) {
        galleryPaths = await uploadProductImages(galleryFiles);
      }

      const payload = {
        id_category: idCategory,
        id_subcategory: idSubcategory,
        name: form.name.trim(),
        caption: form.caption.trim() || null,
        image: imagePath,
        materials: form.materials.trim() || null,
        measures: form.measures.trim() || null,
        quantity: form.quantity.trim() || null,
        details: form.details.trim() || null,
        caution: form.caution.trim() || null,
        colors: form.colors.trim() || null,
        delay: form.delay.trim() || null,
        tags: form.tags.trim() || null,
        new_product: form.new_product,
        galleryImages: galleryPaths,
      };

      if (product) {
        const mode = await submitChange(
          "UPDATE_PRODUCT",
          payload,
          product.id
        );
        setMainImageFile(null);
        onSaved(
          mode === "applied"
            ? "Producto actualizado correctamente."
            : "Actualización enviada para aprobación."
        );
        if (mainImageFile) {
          setFileInputKey((key) => key + 1);
        }
      } else {
        const mode = await submitChange("CREATE_PRODUCT", payload);
        onSaved(
          mode === "applied"
            ? "Producto creado correctamente."
            : "Creación enviada para aprobación."
        );
        setForm(emptyForm);
        resetFileInputs();
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "No se pudo guardar"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddGalleryImages() {
    if (!product || editGalleryFiles.length === 0) return;

    setError("");
    setIsSubmitting(true);

    try {
      const paths = await uploadProductImages(editGalleryFiles);
      let lastMode: "applied" | "pending" = "applied";

      for (const src of paths) {
        lastMode = await submitChange("ADD_IMAGE", { src }, product.id);
      }

      setEditGalleryFiles([]);
      setFileInputKey((key) => key + 1);
      onSaved(
        lastMode === "applied"
          ? "Imágenes agregadas correctamente."
          : "Imágenes enviadas para aprobación."
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudieron agregar las imágenes"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteImage(imageId: number) {
    if (!product) return;

    setError("");
    setIsSubmitting(true);

    try {
      const mode = await submitChange(
        "DELETE_IMAGE",
        { imageId },
        product.id
      );
      onSaved(
        mode === "applied"
          ? "Imagen eliminada correctamente."
          : "Eliminación de imagen enviada para aprobación."
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo eliminar la imagen"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleMainImageChange(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    setMainImageFile(file);
  }

  function handleGalleryFilesChange(fileList: FileList | null) {
    setGalleryFiles(fileList ? Array.from(fileList) : []);
  }

  function handleEditGalleryFilesChange(fileList: FileList | null) {
    setEditGalleryFiles(fileList ? Array.from(fileList) : []);
  }

  return (
    <div className={styles.panel}>
      <div>
        <h2 className={styles.panelTitle}>
          {product ? `Editar producto #${product.id}` : "Nuevo producto"}
        </h2>
        <p className={styles.panelDescription}>
          {user.role === "ADMIN"
            ? "Los cambios se aplican de inmediato."
            : "Tus cambios quedarán pendientes hasta que un admin los apruebe."}
        </p>
      </div>

      <form className={styles.formGrid} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-category">
            Categoría
          </label>
          <select
            id="product-category"
            className={styles.select}
            value={form.id_category}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                id_category: event.target.value,
                id_subcategory: "",
              }))
            }
            required
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-subcategory">
            Subcategoría
          </label>
          <select
            id="product-subcategory"
            className={styles.select}
            value={form.id_subcategory}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                id_subcategory: event.target.value,
              }))
            }
            required
          >
            <option value="">Seleccionar subcategoría</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="product-name">
            Nombre
          </label>
          <input
            id="product-name"
            className={styles.input}
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            required
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="product-caption">
            Caption
          </label>
          <input
            id="product-caption"
            className={styles.input}
            value={form.caption}
            onChange={(event) =>
              setForm((current) => ({ ...current, caption: event.target.value }))
            }
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull} ${styles.uploadField}`}>
          <label className={styles.label} htmlFor="product-main-image">
            Imagen principal
          </label>
          <input
            key={`main-image-${fileInputKey}`}
            id="product-main-image"
            className={styles.fileInput}
            type="file"
            accept={IMAGE_ACCEPT}
            onChange={(event) => handleMainImageChange(event.target.files)}
          />
          <p className={styles.imagePreviewMeta}>
            JPG, PNG, WEBP o GIF · máximo 5 MB
          </p>
          {mainImagePreview && (
            <div className={styles.imagePreviewWrap}>
              <img
                src={mainImagePreview}
                alt="Vista previa imagen principal"
                className={styles.imagePreview}
              />
              {form.image && !mainImageFile && (
                <p className={styles.imagePreviewMeta}>{form.image}</p>
              )}
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-tags">
            Tags
          </label>
          <input
            id="product-tags"
            className={styles.input}
            value={form.tags}
            onChange={(event) =>
              setForm((current) => ({ ...current, tags: event.target.value }))
            }
            placeholder="tag1, tag2"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-quantity">
            Opciones de cantidad
          </label>
          <input
            id="product-quantity"
            className={styles.input}
            value={form.quantity}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                quantity: event.target.value,
              }))
            }
            placeholder="1, 10, 50"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-colors">
            Colores
          </label>
          <input
            id="product-colors"
            className={styles.input}
            value={form.colors}
            onChange={(event) =>
              setForm((current) => ({ ...current, colors: event.target.value }))
            }
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-materials">
            Materiales
          </label>
          <input
            id="product-materials"
            className={styles.input}
            value={form.materials}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                materials: event.target.value,
              }))
            }
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="product-measures">
            Medidas
          </label>
          <input
            id="product-measures"
            className={styles.input}
            value={form.measures}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                measures: event.target.value,
              }))
            }
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="product-details">
            Detalles
          </label>
          <textarea
            id="product-details"
            className={styles.textarea}
            value={form.details}
            onChange={(event) =>
              setForm((current) => ({ ...current, details: event.target.value }))
            }
          />
        </div>

        {!product && (
          <div className={`${styles.field} ${styles.formGridFull} ${styles.uploadField}`}>
            <label className={styles.label} htmlFor="product-gallery">
              Imágenes de galería
            </label>
            <input
              key={`gallery-${fileInputKey}`}
              id="product-gallery"
              className={styles.fileInput}
              type="file"
              accept={IMAGE_ACCEPT}
              multiple
              onChange={(event) => handleGalleryFilesChange(event.target.files)}
            />
            <p className={styles.imagePreviewMeta}>
              Puedes seleccionar varias imágenes.
            </p>
            {galleryFiles.length > 0 && (
              <ul className={styles.pendingGalleryList}>
                {galleryFiles.map((file) => (
                  <li key={`${file.name}-${file.size}`} className={styles.pendingGalleryItem}>
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className={`${styles.checkboxRow} ${styles.formGridFull}`}>
          <input
            id="product-new"
            type="checkbox"
            checked={form.new_product}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                new_product: event.target.checked,
              }))
            }
          />
          <label className={styles.label} htmlFor="product-new">
            Marcar como producto novedoso
          </label>
        </div>

        {error && (
          <p className={`${styles.error} ${styles.formGridFull}`}>{error}</p>
        )}

        <div className={`${styles.buttonRow} ${styles.formGridFull}`}>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Guardando..."
              : product
                ? "Guardar producto"
                : "Crear producto"}
          </button>
        </div>
      </form>

      {product && (
        <section className={styles.formGridFull}>
          <h3 className={styles.panelTitle}>Imágenes de galería</h3>
          <ul className={styles.imageList}>
            {product.images.map((image) => (
              <li key={image.id} className={styles.imageItem}>
                <div className={styles.imagePreviewWrap}>
                  <img
                    src={image.src}
                    alt=""
                    className={styles.imagePreview}
                  />
                  <span>{image.src}</span>
                </div>
                <button
                  type="button"
                  className={styles.dangerButton}
                  onClick={() => handleDeleteImage(image.id)}
                  disabled={isSubmitting}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className={`${styles.uploadField} ${styles.formGridFull}`}>
            <label className={styles.label} htmlFor="product-gallery-add">
              Agregar imágenes a la galería
            </label>
            <input
              key={`gallery-add-${fileInputKey}`}
              id="product-gallery-add"
              className={styles.fileInput}
              type="file"
              accept={IMAGE_ACCEPT}
              multiple
              onChange={(event) =>
                handleEditGalleryFilesChange(event.target.files)
              }
            />
            {editGalleryFiles.length > 0 && (
              <ul className={styles.pendingGalleryList}>
                {editGalleryFiles.map((file) => (
                  <li
                    key={`${file.name}-${file.size}`}
                    className={styles.pendingGalleryItem}
                  >
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleAddGalleryImages}
                disabled={isSubmitting || editGalleryFiles.length === 0}
              >
                Subir imágenes
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
