import { Calendar, MessageSquare } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import styles from './page.module.css';

async function getSiteContent(page) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('section, key, content')
    .eq('page', page);
  
  if (error) {
    console.error('Error fetching content:', error);
    return {};
  }

  return data.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = {};
    acc[item.section][item.key] = item.content;
    return acc;
  }, {});
}

export default async function Clases() {
  const content = await getSiteContent('clases');

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
              <li>• Duración: 2 horas (120 min)</li>
              <li>• Edad mínima: 12 años</li>
              <li>• Incluye: Equipo completo e instrucción profesional</li>
            </ul>
            <button className={styles.btnSecondary}>
              Reservá tu primer clase <Calendar size={18} />
            </button>
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
              <li>• Duración: 2 horas por sesión</li>
              <li>• Frecuencia: 1 o 2 veces por semana</li>
              <li>• Incluye: Equipo del club e instrucción de profesores</li>
            </ul>
            <button className={styles.btnSecondary}>
              Consultar cupos <MessageSquare size={18} />
            </button>
          </div>
          <div className={styles.imgCol} style={{backgroundImage: `url('${content.practica?.image || '/images/generated-1777765463392.png'}')`}}></div>
        </div>
      </section>
      
      {/* Section 3: Regalá */}
      <section className={styles.sectionWhite}>
        <div className={styles.contentWrap}>
          <div className={styles.imgCol} style={{backgroundImage: `url('${content.gift?.image || '/images/generated-1777764819442.png'}')`}}></div>
          <div className={styles.textCol}>
            <h2 className={styles.sectionTitle}>{content.gift?.title}</h2>
            <p className={styles.sectionP}>
              {content.gift?.text}
            </p>
            <ul className={styles.sectionList}>
              <li>• Incluye: Clase de 2 horas, equipo completo e instrucción</li>
              <li>• Formato: Voucher digital o físico</li>
              <li>• Validez: 90 días desde la compra</li>
            </ul>
            <button className={styles.btnSecondary}>
              Consultar por Gift Card
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
