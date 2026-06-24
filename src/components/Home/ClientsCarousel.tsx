import { getClientLogos } from "@/lib/clientLogos";
import { HomeSection, SectionHeader } from "./HomeSection";
import ClientsMarquee from "./ClientsMarquee";

export default function ClientsCarousel() {
  const items = getClientLogos();

  return (
    <HomeSection id="clientes" variant="muted">
      <SectionHeader
        eyebrow="Respaldan nuestra trayectoria"
        title="Clientes que nos eligen"
        description="Acompañamos el crecimiento de empresas e instituciones que eligen la calidad de nuestros trabajos."
      />

      <ClientsMarquee items={items} />
    </HomeSection>
  );
}
