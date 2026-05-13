import Link from 'next/link';
import styles from './page.module.css';

export default function Gracias() {
  return (
    <div className={styles.container}>
      <section className={styles.content}>
        <div className={styles.iconContainer}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="6"></circle>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M12 10l5 -5"></path>
          </svg>
        </div>
        <h1 className={styles.title}>¡Diste en el blanco!</h1>
        <p className={styles.subtitle}>
          Gracias por contactarnos. Hemos recibido tu consulta y un miembro de nuestro equipo te responderá a la brevedad.
        </p>
        <Link href="/" className={styles.homeBtn}>
          Volver al inicio
        </Link>
      </section>
    </div>
  );
}
