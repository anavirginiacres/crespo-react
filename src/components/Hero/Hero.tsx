import Link from "next/link";
import Image from "next/image";
import logoBlanco from "@/styles/images/logo-blanco.png";
import styles from "./Hero.module.scss";

const highlights = ["Diseño gráfico", "Textil", "Tecnología", "Producción"];

export default function Hero() {
  return (
    <section className={styles.hero} aria-label="Presentación">
      <div className={styles.background}>
        <span className={styles.orbPink} aria-hidden="true" />
        <span className={styles.orbBlue} aria-hidden="true" />
        <span className={styles.orbYellow} aria-hidden="true" />
        <span className={styles.grid} aria-hidden="true" />
      </div>

      <div className={styles.content}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Industria gráfica &amp; textil</p>

          <h1 className={styles.title}>
            Creatividad <span className={styles.titleAccent}>que se ve</span>
            <br />
            Donde tus ideas <span className={styles.titleAccentAlt}>cobran vida</span>
          </h1>

          <p className={styles.description}>
            Creamos soluciones integrales para potenciar tu empresa.
            Desde diseño gráfico hasta producción textil, tenemos todo lo que necesitás en un solo lugar.
          </p>

          {/* <ul className={styles.tags} aria-label="Especialidades">
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul> */}

          <div className={styles.actions}>
            <Link href="/productos" className={styles.primaryCta}>
              Explorar catálogo
            </Link>
            <Link href="/#contacto" className={styles.secondaryCta}>
              Contáctanos
            </Link>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.visualCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardDot} />
              <span className={styles.cardDot} />
              <span className={styles.cardDot} />
            </div>
            <div className={styles.cardBody}>
              <Image
                src={logoBlanco}
                alt=""
                className={styles.cardLogo}
                priority
              />
              <div className={styles.cardLines}>
                <span />
                <span />
                <span className={styles.cardLineShort} />
              </div>
              <div className={styles.cardSwatches}>
                <span className={styles.swatchPink} />
                <span className={styles.swatchBlue} />
                <span className={styles.swatchYellow} />
              </div>
            </div>
          </div>

          <div className={styles.floatingBadge}>
            <span className={styles.badgeValue}>360°</span>
            <span className={styles.badgeLabel}>Soluciones integrales</span>
          </div>
        </div>
      </div>
    </section>
  );
}
