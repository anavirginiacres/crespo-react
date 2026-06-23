import { HomeSection, SectionHeader } from "./HomeSection";
import styles from "./Home.module.scss";

export default function OurStory() {
  return (
    <HomeSection id="historia">
      <div className={styles.storyLayout}>
        <div className={styles.storyHighlight}>
          <span className={styles.storyNumber}>60+</span>
          <span className={styles.storyYears}>AÑOS DE TRAYECTORIA</span>
        </div>

        <div className={styles.storyText}>
          <SectionHeader
            eyebrow="Nuestra historia"
            title="Más de seis décadas creando con pasión"
            description="Somos FF Crespo, una empresa familiar de Santiago del Estero con trayectoria en industria gráfica y textil."
          />
          <p>
            Desde hace más de 60 años acompañamos a marcas, comercios e
            instituciones con soluciones de diseño, producción gráfica y
            desarrollo textil. Combinamos oficio artesanal con tecnología
            moderna para entregar productos de calidad.
          </p>
          <p>
            Nuestro compromiso es entender cada proyecto, asesorarte en cada
            etapa y convertir tus ideas en productos con identidad propia.
          </p>
        </div>
      </div>
    </HomeSection>
  );
}
