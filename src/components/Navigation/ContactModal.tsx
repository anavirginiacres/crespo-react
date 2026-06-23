"use client";

import styles from "./Nav.module.scss";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2 id="contact-modal-title" className={styles.modalTitle}>
          Contacto
        </h2>

        <div className={styles.modalContent}>
          <p>
            <strong>FF Crespo</strong>
            <br />
            Industria Gráfica y Textil
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:info@ffcrespo.com">info@ffcrespo.com</a>
          </p>
          <p>
            <strong>Teléfono:</strong>{" "}
            <a href="tel:+5491112345678">+54 9 11 1234-5678</a>
          </p>
          <p>
            <strong>Dirección:</strong> Av. Corrientes 1234, CABA, Argentina
          </p>
          <p>
            <strong>Horario:</strong> Lun a Vie, 9:00 – 18:00 hs
          </p>
        </div>
      </div>
    </div>
  );
}
