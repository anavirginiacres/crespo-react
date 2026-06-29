import { ReactNode } from "react";
import ScrollReveal from "./ScrollReveal";
import styles from "./Home.module.scss";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  light = false,
}: SectionHeaderProps) {
  return (
    <header
      className={`${styles.sectionHeader}${
        light ? ` ${styles.sectionHeaderLight}` : ""
      }`}
    >
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {description && <p className={styles.sectionDescription}>{description}</p>}
    </header>
  );
}

type HomeSectionProps = {
  id?: string;
  children: ReactNode;
  variant?: "default" | "muted" | "dark" | "gradient";
  className?: string;
  revealDelay?: number;
};

const variantClass: Record<NonNullable<HomeSectionProps["variant"]>, string> = {
  default: styles.sectionDefault,
  muted: styles.sectionMuted,
  dark: styles.sectionDark,
  gradient: styles.sectionGradient,
};

export function HomeSection({
  id,
  children,
  variant = "default",
  className = "",
  revealDelay = 0,
}: HomeSectionProps) {
  const showOrbs = variant === "default" || variant === "muted";

  return (
    <section
      id={id}
      className={`${styles.section} ${variantClass[variant]} ${className}`}
    >
      {showOrbs && (
        <div className={styles.sectionBackground} aria-hidden="true">
          <span className={styles.orbPink} />
          <span className={styles.orbBlue} />
          <span className={styles.orbYellow} />
        </div>
      )}

      <ScrollReveal className={styles.sectionInner} delay={revealDelay}>
        {children}
      </ScrollReveal>
    </section>
  );
}
