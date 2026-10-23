import truth from "@/content/ground-truth.json";
import layoutStyles from "@/styles/layout.module.scss";
import { NetLaveScene } from "./scene/NetLaveScene";
import styles from "./Contact.module.scss";

export function Contact() {
  return (
    <section
      id="contact"
      className={`${layoutStyles.section} ${styles.contact}`}
      aria-labelledby="contact-heading"
    >
      <NetLaveScene
        variant="field"
        speed={0.6}
        className={styles.contactScene}
      />
      <div className={`${layoutStyles.container} ${styles.contactContent}`}>
        <div>
          <p className={layoutStyles.sectionLabel}>03 — Contact</p>
          <h2
            id="contact-heading"
            className={`${layoutStyles.sectionHeading} ${styles.contactHeading}`}
          >
            Talk to the founders
          </h2>
        </div>
        <div>
          <p className={`${layoutStyles.sectionIntro} ${styles.contactIntro}`}>
            Talk to us about site surveys, sensors and calibration—the next
            steps toward testing treated-wastewater forestry beyond simulation.
          </p>
          <a className={styles.emailLink} href={truth.contactUrl}>
            Contact the project <span aria-hidden="true">↗</span>
          </a>
          <p>
            No contact email has been verified. Use the public project issue
            tracker; do not post private information.
          </p>
        </div>
      </div>
    </section>
  );
}
