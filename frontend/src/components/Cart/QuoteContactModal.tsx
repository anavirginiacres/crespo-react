
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  normalizeClientContact,
  validateClientContactForm,
  type ClientContact,
} from "@/lib/clientContact";
import styles from "./QuoteContactModal.module.scss";

type QuoteContactModalProps = {
  isOpen: boolean;
  initialContact?: Partial<ClientContact>;
  onClose: () => void;
  onSubmit: (contact: ClientContact) => void;
};

export default function QuoteContactModal({
  isOpen,
  initialContact,
  onClose,
  onSubmit,
}: QuoteContactModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setName(initialContact?.name ?? "");
    setPhone(initialContact?.phone ?? "");
    setEmail(initialContact?.email ?? "");
    setError("");
  }, [isOpen, initialContact]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const contact = normalizeClientContact({ name, phone, email });
    const validationError = validateClientContactForm(contact);

    if (validationError) {
      setError(validationError);
      return;
    }

    onSubmit(contact);
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-contact-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2 id="quote-contact-title" className={styles.title}>
          Tus datos de contacto
        </h2>
        <p className={styles.description}>
          Los usaremos para incluirlos en tu solicitud de presupuesto.
        </p>

        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div className={styles.field}>
            <label className={styles.label} htmlFor="quote-contact-name">
              Nombre *
            </label>
            <input
              id="quote-contact-name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              autoComplete="name"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="quote-contact-phone">
              Teléfono
            </label>
            <input
              id="quote-contact-phone"
              type="tel"
              className={styles.input}
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setError("");
              }}
              autoComplete="tel"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="quote-contact-email">
              Email
            </label>
            <input
              id="quote-contact-email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              autoComplete="email"
            />
          </div>

          <p className={styles.hint}>
            * Completá al teléfono y/o email.
          </p>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.primaryButton}>
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
