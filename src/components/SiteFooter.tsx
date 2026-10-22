import layoutStyles from "@/styles/layout.module.scss";
import { navigationLinks } from "./navigationLinks";
import styles from "./SiteFooter.module.scss";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${layoutStyles.container} ${styles.footerContent}`}>
        <p className={styles.wordmark} aria-hidden="true">
          NetLave
        </p>
        <div className={styles.footerDetails}>
          <nav className={styles.navigation} aria-label="Footer">
            {navigationLinks.map((navigationLink) => (
              <a
                key={navigationLink.href}
                className={styles.navigationLink}
                href={navigationLink.href}
              >
                {navigationLink.label}
              </a>
            ))}
          </nav>
          <p>© 2026 NetLave</p>
        </div>
      </div>
    </footer>
  );
}
