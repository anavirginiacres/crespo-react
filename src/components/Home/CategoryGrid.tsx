import Link from "next/link";
import type { CategoryNav } from "@/lib/categories";
import { buildCategoryProductosUrl } from "@/lib/slug";
import CategoryIcon from "./CategoryIcon";
import { HomeSection, SectionHeader } from "./HomeSection";
import styles from "./Home.module.scss";

type CategoryGridProps = {
  categories: CategoryNav[];
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <HomeSection id="categorias" variant="muted">
      <SectionHeader
        eyebrow="Catálogo"
        title="Explorá por categoría"
        description="Descubrí todo lo que podemos crear para tu proyecto."
      />

      <div className={styles.categoryGrid}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={buildCategoryProductosUrl(category.slug)}
            className={styles.categoryCard}
          >
            <div className={styles.categoryIconWrap}>
              <CategoryIcon icon={category.icon} />
            </div>
            <p className={styles.categoryName}>{category.name}</p>
          </Link>
        ))}
      </div>
    </HomeSection>
  );
}
