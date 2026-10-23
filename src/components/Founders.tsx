import Image from "next/image";
import layoutStyles from "@/styles/layout.module.scss";
import styles from "./Founders.module.scss";

const founders = [
  {
    name: "Eyad",
    photo: "/founders/eyad.jpeg",
    role: "[Role, e.g. hardware]",
    bio: "[Two or three lines: background, relevant work and responsibility in the project]",
  },
  {
    name: "Mahmoud",
    photo: "/founders/mahmoud.jpeg",
    role: "[Role]",
    bio: "[Two or three lines: background, relevant work and responsibility in the project]",
  },
  {
    name: "Omar",
    photo: "/founders/omar.jpeg",
    role: "[Role]",
    bio: "[Two or three lines: background, relevant work and responsibility in the project]",
  },
  {
    name: "Hana",
    photo: "/founders/hana.jpeg",
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
                <Image
                  src={founder.photo}
                  alt={`Portrait of ${founder.name}`}
                  fill
                  sizes="(min-width: 1216px) 250px, (min-width: 1024px) calc((100vw - 216px) / 4), (min-width: 768px) calc((100vw - 104px) / 2), calc(100vw - 40px)"
                  className={styles.portraitImage}
                />
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
