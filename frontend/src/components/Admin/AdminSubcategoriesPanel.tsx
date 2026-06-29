
import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./Admin.module.scss";

type SubcategoryRecord = {
  id: number;
  name: string;
};

type CategoryRecord = {
  id: number;
  name: string;
  subcategories: SubcategoryRecord[];
};

export default function AdminSubcategoriesPanel() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadCategories() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/categories");
      const data = (await response.json()) as {
        categories?: CategoryRecord[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudieron cargar las categorías");
      }

      setCategories(data.categories ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar las categorías"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const selectedCategory = useMemo(
    () =>
      categories.find(
        (category) => category.id === Number(selectedCategoryId)
      ) ?? null,
    [categories, selectedCategoryId]
  );

  const subcategories = selectedCategory?.subcategories ?? [];

  function handleCategoryChange(value: string) {
    setSelectedCategoryId(value);
    setNewName("");
    setEditingId(null);
    setEditingName("");
    setMessage("");
    setError("");
  }

  function startEditing(subcategory: SubcategoryRecord) {
    setEditingId(subcategory.id);
    setEditingName(subcategory.name);
    setMessage("");
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingName("");
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const idCategory = Number(selectedCategoryId);
    const name = newName.trim();

    if (!idCategory) {
      setError("Seleccioná una categoría");
      return;
    }

    if (!name) {
      setError("El nombre es obligatorio");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_category: idCategory, name }),
      });

      const data = (await response.json()) as {
        subcategory?: SubcategoryRecord;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo crear la subcategoría");
      }

      setCategories((current) =>
        current.map((category) =>
          category.id === idCategory
            ? {
                ...category,
                subcategories: [...category.subcategories, data.subcategory!].sort(
                  (a, b) => a.name.localeCompare(b.name, "es")
                ),
              }
            : category
        )
      );
      setNewName("");
      setMessage(`Subcategoría "${name}" creada`);
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "No se pudo crear la subcategoría"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(subcategoryId: number) {
    const name = editingName.trim();

    if (!name) {
      setError("El nombre es obligatorio");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/subcategories/${subcategoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = (await response.json()) as {
        subcategory?: SubcategoryRecord;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo actualizar la subcategoría");
      }

      setCategories((current) =>
        current.map((category) =>
          category.id === Number(selectedCategoryId)
            ? {
                ...category,
                subcategories: category.subcategories
                  .map((subcategory) =>
                    subcategory.id === subcategoryId
                      ? data.subcategory!
                      : subcategory
                  )
                  .sort((a, b) => a.name.localeCompare(b.name, "es")),
              }
            : category
        )
      );
      setEditingId(null);
      setEditingName("");
      setMessage(`Subcategoría actualizada a "${name}"`);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "No se pudo actualizar la subcategoría"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.panel}>
      <div>
        <h2 className={styles.panelTitle}>Subcategorías</h2>
        <p className={styles.panelDescription}>
          Elegí una categoría para ver, editar o añadir subcategorías.
        </p>
      </div>

      <div className={styles.subcategoryToolbar}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="subcategory-category">
            Categoría
          </label>
          <select
            id="subcategory-category"
            className={styles.select}
            value={selectedCategoryId}
            onChange={(event) => handleCategoryChange(event.target.value)}
            disabled={isLoading}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      {isLoading ? (
        <p className={styles.panelDescription}>Cargando categorías...</p>
      ) : !selectedCategory ? (
        <p className={styles.panelDescription}>
          Seleccioná una categoría para gestionar sus subcategorías.
        </p>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {subcategories.length === 0 ? (
                  <tr>
                    <td colSpan={2} className={styles.tableEmpty}>
                      Esta categoría aún no tiene subcategorías.
                    </td>
                  </tr>
                ) : (
                  subcategories.map((subcategory) => (
                    <tr key={subcategory.id}>
                      <td>
                        {editingId === subcategory.id ? (
                          <input
                            className={styles.input}
                            value={editingName}
                            onChange={(event) =>
                              setEditingName(event.target.value)
                            }
                            disabled={isSubmitting}
                            aria-label={`Editar ${subcategory.name}`}
                          />
                        ) : (
                          subcategory.name
                        )}
                      </td>
                      <td>
                        {editingId === subcategory.id ? (
                          <div className={styles.buttonRow}>
                            <button
                              type="button"
                              className={styles.primaryButton}
                              onClick={() => handleUpdate(subcategory.id)}
                              disabled={isSubmitting}
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              className={styles.secondaryButton}
                              onClick={cancelEditing}
                              disabled={isSubmitting}
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => startEditing(subcategory)}
                            disabled={isSubmitting || editingId !== null}
                          >
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <form className={styles.subcategoryForm} onSubmit={handleCreate}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="subcategory-new-name">
                Nueva subcategoría
              </label>
              <input
                id="subcategory-new-name"
                className={styles.input}
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder={`Nombre en ${selectedCategory.name}`}
                disabled={isSubmitting}
              />
            </div>
            <div className={styles.subcategoryFormActions}>
              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSubmitting}
              >
                Añadir subcategoría
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
