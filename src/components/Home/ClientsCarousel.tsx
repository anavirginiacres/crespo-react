"use client";

import { HomeSection, SectionHeader } from "./HomeSection";
import styles from "./Home.module.scss";

const placeholderClients = [
  "Cliente 1",
  "Cliente 2",
  "Cliente 3",
  "Cliente 4",
  "Cliente 5",
  "Cliente 6",
];

export default function ClientsCarousel() {
  const items = [...placeholderClients, ...placeholderClients];

  return (
    <HomeSection id="clientes" variant="muted">
      <SectionHeader
        eyebrow="Confianza"
        title="Clientes que nos eligen"
        description="Empresas e instituciones que confían en nosotros. Pronto agregaremos sus logos acá."
      />

      <div className={styles.clientsTrack}>
        <div className={styles.clientsSlider}>
          {items.map((client, index) => (
            <div key={`${client}-${index}`} className={styles.clientLogo}>
              {client}
            </div>
          ))}
        </div>
      </div>
    </HomeSection>
  );
}
