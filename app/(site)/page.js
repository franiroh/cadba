import Link from 'next/link';
import { ArrowRight, MapPin, Clock, Phone, Gift, User, Mail, MessageSquare } from 'lucide-react';
import { getSiteContent } from '@/utils/cms.js';
import styles from './page.module.css';

export default async function Home() {
  const content = await getSiteContent('home');

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSec} style={{ backgroundImage: `url('${content.hero?.image || '/images/generated-1777763987465.png'}')` }}>
        <div className={styles.heroOverlayGradient}></div>
        <div className={styles.heroContentWrap}>
          
          <div className={styles.heroLeft}>
            <div className={styles.heroTitleWrap}>
              <h1 className={styles.mainTitle}>
                {content.hero?.title?.split('clase de arquería')[0]}
                <span className={styles.textAccent}>clase de arquería</span>
                {content.hero?.title?.split('clase de arquería')[1]}
              </h1>
            </div>
            <p className={styles.heroText}>
              {content.hero?.subtitle}
            </p>
            <div className={styles.locationWrap}>
              <MapPin size={18} className={styles.locationIcon} />
              <span className={styles.locationText}>{content.hero?.location}</span>
            </div>
            <div className={styles.heroBtns}>
              <Link href="/clases" className={styles.btnPrimary}>
                {content.hero?.primary_btn} <ArrowRight size={18} />
              </Link>
              <button className={styles.btnOutline}>
                <Gift size={18} /> {content.hero?.secondary_btn}
              </button>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.formHeader}>
              <div className={styles.formBar}></div>
              <h3 className={styles.formTitle}>Consultanos por tu clase</h3>
            </div>
            <form className={styles.heroForm}>
              <div className={styles.inputWrap}>
                <User size={18} className={styles.inputIcon} />
                <input type="text" placeholder="Nombre" className={styles.inputField} />
              </div>
              <div className={styles.inputWrap}>
                <Mail size={18} className={styles.inputIcon} />
                <input type="email" placeholder="Email" className={styles.inputField} />
              </div>
              <div className={styles.inputWrap}>
                <MessageSquare size={18} className={styles.inputIcon} />
                <textarea placeholder="Mensaje" className={styles.inputField} rows={3}></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>
                Enviar consulta <ArrowRight size={16} />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Clases Section */}
      <section className={styles.clasesSec}>
        <div className={styles.sectionContent}>
          <div className={styles.clasesHead}>
            <div className={styles.barSecondary}></div>
            <h2 className={styles.sectionTitle}>{content.clases?.title}</h2>
          </div>
          
          <div className={styles.introTxt}>
            <h3 className={styles.introSubtitle}>{content.clases?.intro_subtitle}</h3>
            <p className={styles.introP}>
              {content.clases?.intro_text}
            </p>
          </div>

          <div className={styles.cardsGrid}>
            <div className={styles.iniciacionCard}>
              <div className={styles.iniImg} style={{ backgroundImage: `url('${content.clases?.card_image || '/images/generated-1777764271413.png'}')` }}></div>
              <div className={styles.iniCont}>
                <h3 className={styles.cardTitleSecondary}>{content.clases?.card_title}</h3>
                <p className={styles.cardP}>
                  {content.clases?.card_text}
                </p>
                <ul className={styles.cardList}>
                  <li>• Duración: 4 clases</li>
                  <li>• Edad mínima: 12 años</li>
                  <li>• Incluye: Equipo e instrucción</li>
                </ul>
                <button className={styles.btnSecondary}>
                  Reservá tu primer clase <ArrowRight size={16} />
                </button>
              </div>
            </div>
            
            <div className={styles.giftCard}>
              <div className={styles.giftIconWrap}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 12 20 22 4 22 4 12"></polyline>
                  <rect x="2" y="7" width="20" height="5"></rect>
                  <line x1="12" y1="22" x2="12" y2="7"></line>
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                </svg>
              </div>
              <div className={styles.txtC}>
                <h3 className={styles.giftTitle}>{content.clases?.gift_title}</h3>
                <p className={styles.giftP}>
                  {content.clases?.gift_text}
                </p>
              </div>
              <button className={styles.btnSecondary}>Más información</button>
            </div>
          </div>
        </div>
      </section>

      {/* Estilos Section */}
      <section className={styles.estilosSec}>
        <div className={styles.sectionContent}>
          <div className={styles.estHead}>
            <div className={styles.titleWrap}>
              <div className={styles.barSecondary}></div>
              <h2 className={styles.sectionTitle}>{content.estilos?.title}</h2>
            </div>
            <p className={styles.estIntroP}>
              {content.estilos?.subtitle}
            </p>
          </div>

          <div className={styles.newEstWrap}>
            <div className={styles.eCard}>
              <div className={styles.eImg} style={{ backgroundImage: `url('${content.estilos?.tradicional_image || '/images/generated-1777764513186.png'}')` }}></div>
              <div className={styles.eTxt}>
                <h3 className={styles.eTitle}>{content.estilos?.tradicional_title}</h3>
                <p className={styles.eP}>{content.estilos?.tradicional_desc}</p>
              </div>
            </div>
            <div className={styles.eCard}>
              <div className={styles.eImg} style={{ backgroundImage: `url('${content.estilos?.recurvo_image || '/images/generated-1777764585553.png'}')` }}></div>
              <div className={styles.eTxt}>
                <h3 className={styles.eTitle}>{content.estilos?.recurvo_title}</h3>
                <p className={styles.eP}>{content.estilos?.recurvo_desc}</p>
              </div>
            </div>
            <div className={styles.eCard}>
              <div className={styles.eImg} style={{ backgroundImage: `url('${content.estilos?.compuesto_image || '/images/generated-1777765068740.png'}')` }}></div>
              <div className={styles.eTxt}>
                <h3 className={styles.eTitle}>{content.estilos?.compuesto_title}</h3>
                <p className={styles.eP}>{content.estilos?.compuesto_desc}</p>
              </div>
            </div>
            <div className={styles.eCard}>
              <div className={styles.eImg} style={{ backgroundImage: `url('${content.estilos?.raso_image || '/images/generated-1777765081476.png'}')` }}></div>
              <div className={styles.eTxt}>
                <h3 className={styles.eTitle}>{content.estilos?.raso_title}</h3>
                <p className={styles.eP}>{content.estilos?.raso_desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className={styles.infoSec}>
        <div className={styles.sectionContent}>
          <div className={styles.infoHead}>
            <div className={styles.barSecondary}></div>
            <h2 className={styles.sectionTitle}>{content.info?.title}</h2>
          </div>
          
          <div className={styles.infoBox}>
            <div className={styles.infoLeftMap}>
              <div className={styles.mapTag}>CAdBA</div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.6865612260656!2d-58.3846618!3d-34.6373197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccb29a28795cd%3A0xc6eb9d46d0a790f9!2sAv.%20V%C3%A9lez%20S%C3%A1rsfield%20268%2C%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1715654321000!5m2!1ses-419!2sar" 
                width="100%" 
                height="100%" 
                style={{border:0, minHeight: '400px'}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
            <div className={styles.infoRightDetails}>
              <div className={styles.iItemRow}>
                <div className={styles.iItemText}>
                  <h3 className={styles.iTitle}>{content.info?.label_hours}</h3>
                  <p className={styles.iSubtitle}>{content.info?.hours}</p>
                </div>
                <Clock size={28} className={styles.iIcon} strokeWidth={1.5} />
              </div>
              <div className={styles.iItemRow}>
                <div className={styles.iItemText}>
                  <h3 className={styles.iTitle}>{content.info?.label_location}</h3>
                  <p className={styles.iSubtitle}>{content.info?.location}</p>
                </div>
                <MapPin size={28} className={styles.iIcon} strokeWidth={1.5} />
              </div>
              <div className={styles.iItemRow}>
                <div className={styles.iItemText}>
                  <h3 className={styles.iTitle}>{content.info?.label_phone}</h3>
                  <p className={styles.iSubtitle}>{content.info?.phone}</p>
                </div>
                <Phone size={28} className={styles.iIcon} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
