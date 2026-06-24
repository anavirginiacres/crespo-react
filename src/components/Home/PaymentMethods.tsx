import Image, { StaticImageData } from "next/image";
import { HomeSection, SectionHeader } from "./HomeSection";
import styles from "./Home.module.scss";
import amexImg from "@/styles/images/cards/amex.svg";
import mastercardImg from "@/styles/images/cards/mastercard.svg";
import naranjaImg from "@/styles/images/cards/naranjax.png";
import sucreditoImg from "@/styles/images/cards/sucredito.svg";
import visaImg from "@/styles/images/cards/visa.png";
import cabalImg from "@/styles/images/cards/cabal.png";

type CardBrand = {
  name: string;
  image: StaticImageData;
};

const cardBrands: CardBrand[] = [
  { name: "Visa", image: visaImg },
  { name: "Mastercard", image: mastercardImg },
  { name: "Amex", image: amexImg },
  { name: "Naranja", image: naranjaImg },
  { name: "Su Crédito", image: sucreditoImg },
  { name: "Cabal", image: cabalImg },
];

export default function PaymentMethods() {
  return (
    <HomeSection id="pagos" variant="muted">
      <SectionHeader
        eyebrow="Medios de pago"
        title="Facilidades para tus proyectos"
        description="Trabajamos con múltiples opciones de pago para garantizarte una experiencia adaptada a tus necesidades."
      />

      <div className={styles.paymentLayout}>
        <div className={styles.paymentMethods}>
          <div className={styles.paymentMethod}>
            <div className={styles.paymentIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div>
              <p className={styles.paymentLabel}>Efectivo</p>
              <p className={styles.paymentDetail}>Pago en nuestra sucursal</p>
            </div>
          </div>

          <div className={styles.paymentMethod}>
            <div className={styles.paymentIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 10h18M7 15h1m4 0h1m4 0h1M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
              </svg>
            </div>
            <div>
              <p className={styles.paymentLabel}>Transferencia bancaria</p>
              <p className={styles.paymentDetail}>Consultá por CBU / alias</p>
            </div>
          </div>

          <div className={styles.paymentMethod}>
            <div className={styles.paymentIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div>
              <p className={styles.paymentLabel}>Tarjetas de débito</p>
            </div>
          </div>

          <div className={styles.paymentMethod}>
            <div className={styles.paymentIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
                <path d="M6 15h.01M10 15h4" />
              </svg>
            </div>
            <div>
              <p className={styles.paymentLabel}>Tarjetas de crédito</p>
              <div className={styles.cardGrid}>
                {cardBrands.map((brand) => (
                  <div key={brand.name} className={styles.cardChip}>
                    <Image
                      src={brand.image}
                      alt=""
                      className={styles.cardChipImage}
                      aria-hidden
                    />
                    <span className={styles.cardChipLabel}>{brand.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.promoPanel}>
          <SectionHeader
            eyebrow="Beneficios vigentes"
            title="Beneficios exclusivos"
            description="Opciones de financiación vigentes con diferentes entidades financieras."
          />
          <div className={styles.promoFlyer}>
            Agregá acá los flyers de promociones con tarjetas de crédito
          </div>
          <div className={styles.promoFlyer}>
            Segundo espacio para campañas y cuotas sin interés
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
