"use client";

import Image from "next/image";
import type { ClientLogo } from "@/lib/clientLogos";
import styles from "./Home.module.scss";

type ClientsMarqueeProps = {
  items: ClientLogo[];
};

export default function ClientsMarquee({ items }: ClientsMarqueeProps) {
  const loopItems = [...items, ...items];

  return (
    <div className={styles.clientsTrack}>
      <div className={styles.clientsSlider}>
        {loopItems.map((client, index) => (
          <div
            key={`${client.kind === "image" ? client.label : client.label}-${index}`}
            className={styles.clientLogo}
          >
            {client.kind === "image" ? (
              <Image
                src={client.image}
                alt={client.label}
                className={styles.clientLogoImage}
              />
            ) : (
              client.label
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
