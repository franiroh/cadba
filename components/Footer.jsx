import { MapPin, Phone } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer({ content }) {
  if (!content) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Logo */}
        <div className={styles.logoWrap}>
          <img src="/images/logo-blanco.png" alt="CAdBA Logo Blanco" className={styles.logo} />
        </div>
        
        {/* Contact Info Column: Location & Phone */}
        <div className={styles.infoColumn}>
          {/* Location */}
          <div className={styles.infoBlock}>
            <MapPin size={24} className={styles.icon} />
            <div className={styles.textStack}>
              <span className={styles.textBold}>{content.address_line1}</span>
              <span className={styles.textNormal}>{content.address_line2}</span>
            </div>
          </div>
          
          {/* Phone & Hours */}
          <div className={styles.infoBlock}>
            <Phone size={24} className={styles.icon} />
            <div className={styles.textStack}>
              <span className={styles.textBold}>{content.phone}</span>
              <span className={styles.textNormal}>{content.hours}</span>
            </div>
          </div>
          {/* Social / Instagram */}
          <a
            href={`https://www.instagram.com/${content.instagram?.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.infoBlock}
            style={{ textDecoration: 'none' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <span className={styles.textBold}>{content.instagram}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
