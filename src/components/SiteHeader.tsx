import Link from "next/link";
import buttonStyles from "@/styles/buttons.module.scss";
import layoutStyles from "@/styles/layout.module.scss";
import { navigationLinks } from "./navigationLinks";
import styles from "./SiteHeader.module.scss";

export function SiteHeader() {
  return (
    <>
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <header className={styles.header}>
        <div className={`${layoutStyles.container} ${styles.headerContent}`}>
          <Link className={styles.wordmark} href="/">
            NetLave
          </Link>
          <nav className={styles.navigation} aria-label="Primary">
            {navigationLinks.map((navigationLink, linkIndex) => (
              <a
                key={navigationLink.href}
                className={styles.navigationLink}
                href={navigationLink.href}
              >
                <span className={styles.navigationNumber} aria-hidden="true">
                  {String(linkIndex + 1).padStart(2, "0")}
                </span>
                {navigationLink.label}
              </a>
            ))}
          </nav>
          <a
            className={`${buttonStyles.primaryButton} ${styles.contactButton}`}
            href="#contact"
          >
            Get in touch
          </a>
        </div>
      </header>
    </>
  );
}
