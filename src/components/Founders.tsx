import layoutStyles from "@/styles/layout.module.scss";
import styles from "./Founders.module.scss";

const founders = [
  {
    name: "[Founder 1 name]",
    role: "[Role, e.g. hardware]",
    bio: "[Two or three lines: background, relevant work and responsibility in the project]",
  },
  {
    name: "[Founder 2 name]",
    role: "[Role]",
    bio: "[Two or three lines: background, relevant work and responsibility in the project]",
  },
  {
    name: "[Founder 3 name]",
    role: "[Role]",
    bio: "[Two or three lines: background, relevant work and responsibility in the project]",
  },
  {
    name: "[Founder 4 name]",
    role: "[Role]",
    bio: "[Two or three lines: background, relevant work and responsibility in the project]",
  },
];

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
          {founders.map((founder) => (
            <li key={founder.name} className={styles.founder}>
              <div className={styles.portrait}>
                <div className={styles.portraitCaption}>
                  <h3 className={styles.founderName}>{founder.name}</h3>
                  <p className={styles.founderRole}>{founder.role}</p>
                </div>
              </div>
              <p className={styles.founderBio}>{founder.bio}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
