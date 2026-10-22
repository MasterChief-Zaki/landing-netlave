import buttonStyles from "@/styles/buttons.module.scss";
import layoutStyles from "@/styles/layout.module.scss";
import { NetLaveScene } from "./scene/NetLaveScene";
import styles from "./Contact.module.scss";

// Placeholder until the real founders' address is decided.
const contactEmail = "founders@example.com";

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
            [One sentence on what to reach out about: partnerships, pilots or
            investment]
          </p>
          <div className={styles.emailDetails}>
            <a
              className={buttonStyles.primaryButton}
              href={`mailto:${contactEmail}`}
            >
              Email the founders
            </a>
            <p className={styles.emailAddress}>{contactEmail}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
