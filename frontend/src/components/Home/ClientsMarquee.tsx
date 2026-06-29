
import Image from "@/components/common/Image";
import type { ClientLogo } from "@/lib/clientLogos";
import styles from "./Home.module.scss";

type ClientsMarqueeProps = {
  items: ClientLogo[];
};

const LOGO_WIDTH = 140;
const LOGO_HEIGHT = 72;

export default function ClientsMarquee({ items }: ClientsMarqueeProps) {
  const loopItems = [...items, ...items];

  return (
    <div className={styles.clientsTrack}>
      <div className={styles.clientsSlider}>
        {loopItems.map((client, index) => {
          const isDuplicate = index >= items.length;

          return (
            <div
              key={`${client.label}-${index}`}
              className={styles.clientLogo}
              aria-hidden={isDuplicate ? true : undefined}
            >
              <Image
                src={client.image}
                alt={isDuplicate ? "" : client.label}
                className={styles.clientLogoImage}
                width={LOGO_WIDTH}
                height={LOGO_HEIGHT}
                sizes={`${LOGO_WIDTH}px`}
                quality={75}
                loading="lazy"
                decoding="async"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
