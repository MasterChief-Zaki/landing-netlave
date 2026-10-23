import layoutStyles from "@/styles/layout.module.scss";
import { NetLaveScene } from "./scene/NetLaveScene";
import styles from "./Idea.module.scss";

const ideaSteps = [
  {
    title: "Reclaim water for forestry",
    description:
      "Treated sewage effluent (TSE) supplies a reservoir for forest irrigation. The prototype models continuous inflow, supply interruptions and overflow.",
  },
  {
    title: "Irrigate with explainable control",
    description:
      "A controller requests water for three drip zones: two gravity-fed and one pumped uphill. Safety checks gate delivery on water quality, filtration, storage, hydraulic head and available power.",
  },
  {
    title: "Power within physical limits",
    description:
      "Micro-hydro recovers energy from incoming water, while solar and battery storage support the uphill pump and auxiliary loads. Pumping is denied when power or battery reserves are insufficient.",
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
              Test a self-powered forest before planting it.
            </h2>
            <p className={layoutStyles.sectionIntro}>
              NetLave models a treated-wastewater-irrigated forest in Egypt,
              linking water storage, soil moisture and renewable power. Its
              digital twin lets you explore faults and compare irrigation
              strategies. The prototype uses synthetic site assumptions, not
              field measurements, and does not establish real-world savings or
              regulatory approval.
            </p>
          </div>
          <figure className={styles.knotFigure}>
            <NetLaveScene
              variant="knot"
              speed={0.8}
              className={styles.knotScene}
            />
            <figcaption className={styles.knotCaption}>
              Fig. 02 — three connected systems
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
