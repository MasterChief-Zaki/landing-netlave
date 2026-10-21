import buttonStyles from "@/styles/buttons.module.scss";
import layoutStyles from "@/styles/layout.module.scss";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`${layoutStyles.container} ${styles.heroContent}`}>
        <p className={styles.eyebrow}>[Category, e.g. smart irrigation]</p>
        <h1 className={styles.headline}>[The pitch in one line]</h1>
        <p className={styles.subheadline}>
          [One or two sentences on what NetLave does and who it is for]
        </p>
        <div className={styles.callsToAction}>
          <a className={buttonStyles.primaryButton} href="#contact">
            Get in touch
          </a>
          <a className={buttonStyles.secondaryButton} href="#founders">
            Meet the founders
          </a>
        </div>
      </div>
    </section>
  );
}
