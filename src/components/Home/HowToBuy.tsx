import { HomeSection, SectionHeader } from "./HomeSection";
import styles from "./Home.module.scss";

const steps = [
  {
    title: "Navegá el catálogo",
    text: "Explorá nuestro catálogo y encontrá los productos que se adaptan a tu proyecto.",
  },
  {
    title: "Armá tu pedido",
    text: "Agregá los productos que te gusten, seleccionando cantidades, medidas, colores y materiales.",
  },
  {
    title: "Agregá observaciones",
    text: "Incluí notas adicionales o envianos tu logo si el diseño lo requiere.",
  },
  {
    title: "Enviá tu consulta",
    text: "Cuando termines con tu carrito, envianos tu consulta por WhatsApp o email.",
  },
  {
    title: "Recibí tu presupuesto",
    text: "Realizaremos la cotización y te enviaremos el presupuesto a la brevedad.",
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
        {steps.map((step) => (
          <li key={step.title} className={styles.stepItem}>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepText}>{step.text}</p>
          </li>
        ))}
      </ol>
    </HomeSection>
  );
}
