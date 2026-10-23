import Image from "next/image";
import truth from "@/content/ground-truth.json";
import layoutStyles from "@/styles/layout.module.scss";
import styles from "./Founders.module.scss";

export function Founders() {
  return (
    <section
      id="founders"
      className={`${layoutStyles.section} ${styles.foundersSection}`}
      aria-labelledby="founders-heading"
    >
      <div className={layoutStyles.container}>
        <div className={styles.foundersHeader}>
          <div>
            <p className={layoutStyles.sectionLabel}>02 — Founders</p>
            <h2
              id="founders-heading"
              className={`${layoutStyles.sectionHeading} ${styles.foundersHeading}`}
            >
              Meet the
              <br />
              founders
            </h2>
          </div>
          <p className={`${layoutStyles.sectionIntro} ${styles.foundersIntro}`}>
            NetLave brings water, energy and explainable irrigation control
            together in a simulation-driven forest prototype.
          </p>
        </div>
        <ul className={styles.founderList}>
          {truth.founders.map((name) => (
            <li key={name} className={styles.founder}>
              <div className={styles.portrait}>
                <Image
                  src={`/founders/${name.toLowerCase()}.jpeg`}
                  alt={`Portrait of ${name}`}
                  fill
                  sizes="(min-width: 1216px) 250px, (min-width: 1024px) calc((100vw - 216px) / 4), (min-width: 768px) calc((100vw - 104px) / 2), calc(100vw - 40px)"
                  className={styles.portraitImage}
                />
                <div className={styles.portraitCaption}>
                  <h3 className={styles.founderName}>{name}</h3>
                  <p className={styles.founderRole}>Co-founder</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
