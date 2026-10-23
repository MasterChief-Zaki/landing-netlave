import truth from "@/content/ground-truth.json";
import buttonStyles from "@/styles/buttons.module.scss";
import layoutStyles from "@/styles/layout.module.scss";
import { NetLaveScene } from "./scene/NetLaveScene";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section className={styles.hero}>
      <NetLaveScene variant="both" className={styles.heroScene} />
      <div className={`${layoutStyles.container} ${styles.heroContent}`}>
        <div className={styles.topRow}>
          <p className={styles.categoryPill}>Digital twin · TSE forestry</p>
          <p className={styles.pageMeta} aria-hidden="true">
            Simulation prototype · Egypt
          </p>
        </div>
        <h1 className={styles.headline}>{truth.tagline}</h1>
        <div className={styles.bottomRow}>
          <div className={styles.introduction}>
            <p className={styles.subheadline}>{truth.description}</p>
            <div className={styles.callsToAction}>
              <a className={buttonStyles.primaryButton} href="#contact">
                Get in touch
              </a>
              <a className={buttonStyles.secondaryButton} href="#founders">
                Meet the founders
              </a>
            </div>
          </div>
          <p className={styles.figureCaption} aria-hidden="true">
            Fig. 01 — water, energy and control
            <br />
            <span className={styles.liveLabel}>Animated · WebGL</span>
          </p>
        </div>
        <p className={styles.cycleCaption} aria-hidden="true">
          TSE → micro-hydro → reservoir → irrigation
        </p>
      </div>
    </section>
  );
}
