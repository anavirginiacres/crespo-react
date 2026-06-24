import Link from "next/link";
import Image from "next/image";
import logoBlanco from "@/styles/images/logo-blanco.png";
import styles from "./Footer.module.scss";

const quickLinks = [
  { label: "Catálogo", href: "/productos" },
  { label: "Posteos", href: "/posteos" },
  { label: "Novedades", href: "/#novedades" },
  { label: "Cómo comprar", href: "/#como-comprar" },
  { label: "Medios de pago", href: "/#pagos" },
  { label: "Contacto", href: "/#contacto" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/ff.crespo",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/ffcrespo",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/5493854892451",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGlow} aria-hidden="true" />

      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div className={styles.brandColumn}>
            <Link href="/" className={styles.logoLink}>
              <Image
                src={logoBlanco}
                alt="FF Crespo"
                className={styles.logo}
                priority={false}
              />
            </Link>
            <p className={styles.tagline}>
              Industria gráfica & textil · Más de 60 años en Santiago del Estero
            </p>
            <div className={styles.socialList}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.linksColumn}>
            <h2 className={styles.columnTitle}>Enlaces</h2>
            <ul className={styles.linkList}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.contactColumn}>
            <h2 className={styles.columnTitle}>Contacto</h2>
            <ul className={styles.contactList}>
              <li>
                <a href="mailto:info@ffcrespo.com" className={styles.footerLink}>
                  info@ffcrespo.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5493854892451"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  WhatsApp Gráfica · +54 9 3854 89-2451
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5493855059646"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  WhatsApp Textil · +54 9 3855 05-9646
                </a>
              </li>
              <li className={styles.address}>
                Av. Libertad 358
                <br />
                Santiago del Estero, Capital
              </li>
            </ul>
          </div>

          <div className={styles.hoursColumn}>
            <h2 className={styles.columnTitle}>Horarios</h2>
            <ul className={styles.hoursList}>
              <li>
                <span>Lunes a Viernes</span>
                <span>08:30 – 12:30  &  17:00 – 21:00</span>
              </li>
              <li>
                <span>Sábados</span>
                <span>09:00 – 13:00</span>
              </li>
            </ul>
            <p className={styles.hoursNote}>
              Consultá promociones y medios de pago en nuestra web o por WhatsApp.
            </p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {year} FF Crespo. Todos los derechos reservados.
          </p>
          <p className={styles.credit}>
            Diseño gráfico · Textil · Producción integral
          </p>
        </div>
      </div>
    </footer>
  );
}
