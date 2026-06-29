
import { useRouter, useSearchParams } from "@/lib/router";
import { FormEvent, useState } from "react";
import styles from "./Admin.module.scss";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "No se pudo iniciar sesión");
        return;
      }

      const next = searchParams.get("next") || "/admin/products";
      router.push(next);
      router.refresh();
    } catch {
      setError("No se pudo iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <h1 className={styles.panelTitle}>Ingreso al admin</h1>
        <p className={styles.panelDescription}>
          Gestioná los productos. *Los cambios de usuarios requieren
          aprobación de un administrador.
        </p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="admin-username">
            Usuario
          </label>
          <input
            id="admin-username"
            className={styles.input}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="admin-password">
            Contraseña
          </label>
          <input
            id="admin-password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.primaryButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
