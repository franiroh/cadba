"use client";

import Link from 'next/link';
import { ArrowRight, MapPin, User, Mail, MessageSquare, Clock, Phone, Gift } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSec}>
        <div className={styles.heroOverlayGradient}></div>
        <div className={styles.heroContentWrap}>
          
          <div className={styles.heroLeft}>
            <div className={styles.heroTitleWrap}>
              <h1 className={styles.mainTitle}>
                Probá una <br />
                <span className={styles.textAccent}>clase de arquería</span><br />
                en Buenos Aires
              </h1>
            </div>
            <p className={styles.heroText}>
              No hace falta experiencia ni equipo. Viví una actividad distinta, con clases de iniciación para principiantes.
            </p>
            <div className={styles.locationWrap}>
              <MapPin size={18} className={styles.locationIcon} />
              <span className={styles.locationText}>Barracas, CABA</span>
            </div>
            <div className={styles.heroBtns}>
              <Link href="/clases" className={styles.btnPrimary}>
                Consultá cupos <ArrowRight size={18} />
              </Link>
              <button className={styles.btnOutline}>
                <Gift size={18} /> Regalá una clase
              </button>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.formHeader}>
              <div className={styles.formBar}></div>
              <h3 className={styles.formTitle}>Consultanos por tu clase</h3>
            </div>
            <form className={styles.heroForm} onSubmit={(e) => e.preventDefault()}>
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
            <h2 className={styles.sectionTitle}>Iniciación y clases para todos los niveles</h2>
          </div>
          
          <div className={styles.introTxt}>
            <h3 className={styles.introSubtitle}>Tu camino en la arquería</h3>
            <p className={styles.introP}>
              En el Club de Arquería de Buenos Aires (CAdBA) creemos que cada arquero tiene un camino único. Por eso, te acompañamos desde tus primeros pasos en la iniciación hasta alcanzar niveles de competición nacional, brindando un ambiente profesional y humano donde podrás desarrollar tu técnica y pasión por este deporte milenario.
            </p>
          </div>

          <div className={styles.cardsGrid}>
            <div className={styles.iniciacionCard}>
              <div className={styles.iniImg}></div>
              <div className={styles.iniCont}>
                <h3 className={styles.cardTitleSecondary}>Clase de Iniciación</h3>
                <p className={styles.cardP}>
                  La puerta de entrada ideal al mundo de la arquería. Enfocada en brindarte las medidas fundamentales de seguridad y el manejo básico del arco.
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
                <h3 className={styles.giftTitle}>Regalá una experiencia</h3>
                <p className={styles.giftP}>
                  Sorprendé a alguien regalando una clase de iniciación en arquería. Podés regalar la experiencia o venir juntos para compartir este deporte.
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
              <h2 className={styles.sectionTitle}>Descubrí tu estilo de arquería</h2>
            </div>
            <p className={styles.estIntroP}>
              En CAdBA, una vez formadas las nociones básicas, podés elegir el estilo de arquería que más te divierta. Cada uno tiene sus particularidades y su propio camino de aprendizaje.
            </p>
          </div>

          <div className={styles.newEstWrap}>
            <div className={styles.eCard}>
              <div className={styles.e1Img} style={{backgroundImage: "url('/images/generated-1777764723827.png')"}}></div>
              <div className={styles.eTxt}>
                <h3 className={styles.eTitle}>Tradicional</h3>
                <p className={styles.eP}>Calibre en sus dimensiones y materiales imitando los ajustes instintivos. Su particularidad es el tiro intuitivo e instintivo, enfocándose en la conexión boscosa y armónica.</p>
              </div>
            </div>
            <div className={styles.eCard}>
              <div className={styles.e2Img} style={{backgroundImage: "url('/images/generated-1777764881194.png')"}}></div>
              <div className={styles.eTxt}>
                <h3 className={styles.eTitle}>Recurvo</h3>
                <p className={styles.eP}>Es el estilo presente en los Juegos Olímpicos. Utiliza elementos de precisión como miras y estabilizadores. Se distingue por su enfoque en la alineación, el logro y la postura estandarizada.</p>
              </div>
            </div>
            <div className={styles.eCard}>
              <div className={styles.e3Img} style={{backgroundImage: "url('/images/generated-1777764910374.png')"}}></div>
              <div className={styles.eTxt}>
                <h3 className={styles.eTitle}>Compuesto</h3>
                <p className={styles.eP}>Utiliza un sistema de poleas que reduce el esfuerzo necesario para sostener el arco en apunte. Se diferencia por su diseño tecnológico, ofreciendo gran velocidad de flecha y precisión milimétrica.</p>
              </div>
            </div>
            <div className={styles.eCard}>
              <div className={styles.e4Img} style={{backgroundImage: "url('/images/generated-1777764639003.png')"}}></div>
              <div className={styles.eTxt}>
                <h3 className={styles.eTitle}>Raso</h3>
                <p className={styles.eP}>Arco de un modelo puro sin miras ni estabilizadores. Se diferencia en que el arquero calcula el apunte visualmente, estimando mentalmente el tiro en forma manual.</p>
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
            <h2 className={styles.sectionTitle}>Vení a conocernos</h2>
          </div>
          
          <div className={styles.infoBox}>
            <div className={styles.infoLeftMap}>
              <div className={styles.mapTag}>CAdBA</div>
              {/* Simulando el mapa con un iframe de Google Maps a Barracas */}
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
                  <h3 className={styles.iTitle}>Horarios</h3>
                  <p className={styles.iSubtitle}>Lunes a Sábados de 10 a 22 hs</p>
                </div>
                <Clock size={28} className={styles.iIcon} strokeWidth={1.5} />
              </div>

              <div className={styles.iItemRow}>
                <div className={styles.iItemText}>
                  <h3 className={styles.iTitle}>Dirección</h3>
                  <p className={styles.iSubtitle}>Av. Vélez Sársfield 268, Barracas</p>
                </div>
                <MapPin size={28} className={styles.iIcon} strokeWidth={1.5} />
              </div>

              <div className={styles.iItemRow}>
                <div className={styles.iItemText}>
                  <h3 className={styles.iTitle}>Teléfono</h3>
                  <p className={styles.iSubtitle}>+54 9 11 6232-9424</p>
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
