import { Calendar, MessageSquare } from 'lucide-react';
import { getSiteContent } from '@/utils/cms';
import styles from './page.module.css';

export default async function Clases() {
  const content = await getSiteContent('clases');

  const renderDetails = (details) => {
    if (!details) return null;
    return details.split('\n').map((item, index) => (
      <li key={index}>• {item.replace('• ', '')}</li>
    ));
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSec} style={{ backgroundImage: `url('${content.hero?.image || '/images/generated-1777765081476.png'}')` }}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>{content.hero?.title}</h1>
          <p className={styles.heroSubtitle}>{content.hero?.subtitle}</p>
        </div>
      </section>

      {/* Section 1: Iniciación */}
      <section className={styles.sectionWhite}>
        <div className={styles.contentWrap}>
          <div className={styles.imgCol} style={{backgroundImage: `url('${content.iniciacion?.image || '/images/generated-1777764271413.png'}')`}}></div>
          <div className={styles.textCol}>
            <h2 className={styles.sectionTitle}>{content.iniciacion?.title}</h2>
            <p className={styles.sectionP}>
              {content.iniciacion?.text}
            </p>
            <ul className={styles.sectionList}>
              {renderDetails(content.iniciacion?.details)}
            </ul>
            <a href={content.iniciacion?.btn_url} className={styles.btnSecondary} target="_blank" rel="noopener noreferrer">
              {content.iniciacion?.btn_text || 'Reservá tu primer clase'} <Calendar size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Section 2: Práctica */}
      <section className={styles.sectionGray}>
        <div className={styles.contentWrapReverse}>
          <div className={styles.textCol}>
            <h2 className={styles.sectionTitle}>{content.practica?.title}</h2>
            <p className={styles.sectionP}>
              {content.practica?.text}
            </p>
            <ul className={styles.sectionList}>
              {renderDetails(content.practica?.details)}
            </ul>
            <a href={content.practica?.btn_url} className={styles.btnSecondary} target="_blank" rel="noopener noreferrer">
              {content.practica?.btn_text || 'Consultar cupos'} <MessageSquare size={18} />
            </a>
          </div>
          <div className={styles.imgCol} style={{backgroundImage: `url('${content.practica?.image || '/images/generated-1777765463392.png'}')`}}></div>
        </div>
      </section>
      
      {/* Section 3: Regalá */}
      <section id="regala" className={styles.sectionWhite}>
        <div className={styles.contentWrap}>
          <div className={styles.imgCol} style={{backgroundImage: `url('${content.gift?.image || '/images/generated-1777764819442.png'}')`}}></div>
          <div className={styles.textCol}>
            <h2 className={styles.sectionTitle}>{content.gift?.title}</h2>
            <p className={styles.sectionP}>
              {content.gift?.text}
            </p>
            <ul className={styles.sectionList}>
              {renderDetails(content.gift?.details)}
            </ul>
            <a href={content.gift?.btn_url} className={styles.btnSecondary} target="_blank" rel="noopener noreferrer">
              {content.gift?.btn_text || 'Consultar por Gift Card'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
