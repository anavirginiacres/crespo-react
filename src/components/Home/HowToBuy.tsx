import { HomeSection, SectionHeader } from "./HomeSection";
import ScrollReveal from "./ScrollReveal";
import styles from "./Home.module.scss";

const steps = [
  {
    title: "Navegá el catálogo",
    text: "Explorá la variedad de opciones y encontrá el producto ideal para tu proyecto.",
  },
  {
    title: "Armá tu pedido",
    text: "Seleccioná los artículos que necesitás detallando cantidades, medidas, colores y materiales.",
  },
  {
    title: "Personalizá los detalles",
    text: "Agregá especificaciones adicionales o adjuntá tu logo si el diseño lo requiere.",
  },
  {
    title: "Enviá tu consulta",
    text: "Finalizá la selección de tu carrito y envianos tu consulta por WhatsApp o email.",
  },
  {
    title: "Recibí tu presupuesto",
    text: "Cotizamos tu pedido de forma personalizada y te enviamos la propuesta a la brevedad.",
  },
];

export default function HowToBuy() {
  return (
    <HomeSection id="como-comprar" variant="dark">
      <SectionHeader
        eyebrow="Cómo comprar"
        title="Tu pedido en 5 simples pasos"
        description="Un proceso claro y personalizado, de la idea al presupuesto final."
        light
      />

      <ol className={styles.stepsList}>
        {steps.map((step, index) => (
          <ScrollReveal
            key={step.title}
            as="li"
            className={styles.stepItem}
            delay={index * 120}
          >
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepText}>{step.text}</p>
          </ScrollReveal>
        ))}
      </ol>
    </HomeSection>
  );
}
