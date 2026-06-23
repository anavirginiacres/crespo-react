import Hero from "@/components/Hero/Hero";
import { getCategories } from "@/lib/categories";
import NewProducts from "@/components/Home/NewProducts";
import CategoryGrid from "@/components/Home/CategoryGrid";
import OurStory from "@/components/Home/OurStory";
import HowToBuy from "@/components/Home/HowToBuy";
import PaymentMethods from "@/components/Home/PaymentMethods";
import ContactSection from "@/components/Home/ContactSection";
import CatalogCta from "@/components/Home/CatalogCta";
import ClientsCarousel from "@/components/Home/ClientsCarousel";
import styles from "@/components/Home/Home.module.scss";

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <Hero />
      <div className={styles.homePage}>
        <NewProducts />
        <CategoryGrid categories={categories} />
        <OurStory />
        <HowToBuy />
        <PaymentMethods />
        <ContactSection />
        <CatalogCta />
        <ClientsCarousel />
      </div>
    </>
  );
}
