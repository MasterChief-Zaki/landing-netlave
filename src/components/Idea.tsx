import layoutStyles from "@/styles/layout.module.scss";
import { NetLaveScene } from "./scene/NetLaveScene";
import styles from "./Idea.module.scss";

const ideaSteps = [
  {
    title: "[Step 1: the water source]",
    description: "[One sentence on what TSE water is and why it is the input]",
  },
  {
    title: "[Step 2: smart irrigation]",
    description: "[One sentence on what the system does with the water]",
  },
  {
    title: "[Step 3: power for the AI and IoT devices]",
    description: "[One sentence on how the cycle powers its own devices]",
  },
];

export function Idea() {
  return (
    <section
      id="idea"
      className={`${layoutStyles.section} ${styles.ideaSection}`}
      aria-labelledby="idea-heading"
    >
      <div className={layoutStyles.container}>
        <div className={styles.introduction}>
          <div>
            <p className={layoutStyles.sectionLabel}>01 — The idea</p>
            <h2
              id="idea-heading"
              className={`${layoutStyles.sectionHeading} ${styles.ideaHeading}`}
            >
              [The problem, or the idea, in one sentence]
            </h2>
            <p className={layoutStyles.sectionIntro}>
              [Two or three sentences on the problem and what the closed cycle
              changes]
            </p>
          </div>
          <figure className={styles.knotFigure}>
            <NetLaveScene
              variant="knot"
              speed={0.8}
              className={styles.knotScene}
            />
            <figcaption className={styles.knotCaption}>
              Fig. 02 — one loop, three stages
            </figcaption>
          </figure>
        </div>
        <ol className={styles.steps}>
          {ideaSteps.map((ideaStep, stepIndex) => (
            <li key={ideaStep.title} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden="true">
                {String(stepIndex + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.stepTitle}>{ideaStep.title}</h3>
              <p className={styles.stepDescription}>{ideaStep.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
