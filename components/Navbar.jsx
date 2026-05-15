import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar({ content }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img src="/images/logo.png" alt="CAdBA Logo" className={styles.logo} />
        </Link>
      </div>
      <div className={styles.links}>
        <Link href="/" className={styles.link}>Inicio</Link>
        <Link href="/clases" className={styles.link}>Clases</Link>
        <Link href="/contacto" className={styles.link}>Contacto</Link>
        <Link href={content?.btn_url || '/contacto'} className={styles.button}>
          {content?.btn_text || 'Reservá tu clase'}
        </Link>
      </div>
    </nav>
  );
}
