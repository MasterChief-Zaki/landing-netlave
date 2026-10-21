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
];

export function Founders() {
  return (
    <section
      id="founders"
      className={layoutStyles.section}
      aria-labelledby="founders-heading"
    >
      <div className={layoutStyles.container}>
        <p className={layoutStyles.sectionLabel}>
          <span className={layoutStyles.sectionNumber}>02</span>
          Founders
        </p>
        <h2 id="founders-heading" className={layoutStyles.sectionHeading}>
          Meet the founders
        </h2>
        <p className={layoutStyles.sectionIntro}>
          [One line on what the founders share: field, studies or previous work]
        </p>
        <ul className={styles.founderList}>
          {founders.map((founder) => (
            <li key={founder.name} className={styles.founder}>
              <div className={styles.photoPlaceholder} aria-hidden="true">
                Photo
              </div>
              <div>
                <h3>{founder.name}</h3>
                <p className={styles.founderRole}>{founder.role}</p>
              </div>
              <p className={styles.founderBio}>{founder.bio}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
