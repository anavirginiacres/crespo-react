
import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./Home.module.scss";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: ScrollRevealProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const liRef = useRef<HTMLLIElement>(null);
  const ref = as === "li" ? liRef : divRef;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -48px 0px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  const revealClassName = `${styles.reveal}${isVisible ? ` ${styles.revealVisible}` : ""} ${className}`;
  const revealStyle = { transitionDelay: `${delay}ms` };

  if (as === "li") {
    return (
      <li ref={liRef} className={revealClassName} style={revealStyle}>
        {children}
      </li>
    );
  }

  return (
    <div ref={divRef} className={revealClassName} style={revealStyle}>
      {children}
    </div>
  );
}
