import { HomeSection, SectionHeader } from "./HomeSection";
import styles from "./Home.module.scss";

const MAP_EMBED =
  "https://maps.google.com/maps?q=Avenida+Libertad+358,+Santiago+del+Estero,+Argentina&output=embed";

export default function ContactSection() {
  return (
    <HomeSection id="contacto">
      <SectionHeader
        eyebrow="Contacto"
        title="Estamos cerca tuyo"
        description="Escribinos por Email o por WhatsApp. Tenemos líneas dedicadas para gráfica y textil."
      />

      <div className={styles.contactLayout}>
        <div className={styles.contactList}>
          <a href="mailto:info@ffcrespo.com" className={styles.contactCard}>
            <p className={styles.contactLabel}>Email</p>
            <p className={styles.contactValue}>info@ffcrespo.com</p>
          </a>

          <a
            href="https://wa.me/5493854892451"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.contactCard} ${styles.contactCardPink}`}
          >
            <p className={styles.contactLabel}>WhatsApp — Gráfica</p>
            <p className={styles.contactValue}>+54 9 3854 89-2451</p>
          </a>

          <a
            href="https://wa.me/5493855059646"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.contactCard} ${styles.contactCardPink}`}
          >
            <p className={styles.contactLabel}>WhatsApp — Textil</p>
            <p className={styles.contactValue}>+54 9 3855 05-9646</p>
          </a>

          <div className={`${styles.contactCard} ${styles.contactCardYellow}`}>
            <p className={styles.contactLabel}>Dirección</p>
            <p className={styles.contactValue}>
              Av. Libertad 358, Santiago del Estero
            </p>
          </div>
        </div>

        <div className={styles.mapWrap}>
          <iframe
            title="Ubicación FF Crespo — Av. Libertad 358, Santiago del Estero"
            src={MAP_EMBED}
            className={styles.mapFrame}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </HomeSection>
  );
}
