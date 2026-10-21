import buttonStyles from "@/styles/buttons.module.scss";
import layoutStyles from "@/styles/layout.module.scss";
import styles from "./Contact.module.scss";

// Placeholder until the real founders' address is decided.
const contactEmail = "founders@example.com";

export function Contact() {
  return (
    <section
      id="contact"
      className={layoutStyles.section}
      aria-labelledby="contact-heading"
    >
      <div className={layoutStyles.container}>
        <p className={layoutStyles.sectionLabel}>
          <span className={layoutStyles.sectionNumber}>03</span>
          Contact
        </p>
        <div className={styles.contactContent}>
          <div>
            <h2 id="contact-heading" className={layoutStyles.sectionHeading}>
              Talk to the founders
            </h2>
            <p className={layoutStyles.sectionIntro}>
              [One sentence on what to reach out about: partnerships, pilots or
              investment]
            </p>
          </div>
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
