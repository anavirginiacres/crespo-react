import Hero from "@/components/Hero/Hero";
import NewProducts from "@/components/Home/NewProducts";
import CategoryGrid from "@/components/Home/CategoryGrid";
import OurStory from "@/components/Home/OurStory";
import HowToBuy from "@/components/Home/HowToBuy";
import PaymentMethods from "@/components/Home/PaymentMethods";
import ContactSection from "@/components/Home/ContactSection";
import CatalogCta from "@/components/Home/CatalogCta";
import ClientsCarousel from "@/components/Home/ClientsCarousel";
import ScrollToHash from "@/components/Home/ScrollToHash";
import styles from "@/components/Home/Home.module.scss";
import { useEffect, useState } from "react";
import { api, type CategoryNav } from "@/lib/api";

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryNav[]>([]);

  useEffect(() => {
    api
      .getCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => setCategories([]));
  }, []);

  return (
    <>
      <ScrollToHash />
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
