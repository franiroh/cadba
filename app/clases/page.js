"use client";

import { Calendar, MessageSquare } from 'lucide-react';
import styles from './page.module.css';

export default function Clases() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSec}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>Iniciación y clases para todos los niveles</h1>
          <p className={styles.heroSubtitle}>Desde tus primeros pasos hasta la alta competencia</p>
        </div>
      </section>

      {/* Section 1: Iniciación */}
      <section className={styles.sectionWhite}>
        <div className={styles.contentWrap}>
          <div className={styles.imgCol} style={{backgroundImage: "url('/images/generated-1777764271413.png')"}}></div>
          <div className={styles.textCol}>
            <h2 className={styles.sectionTitle}>Clase de Iniciación</h2>
            <p className={styles.sectionP}>
              La puerta de entrada ideal al mundo de la arquería. En esta clase nos enfocamos en brindarte las medidas fundamentales de seguridad y el manejo básico del arco, para que puedas disparar tus primeras flechas con una noción general de técnica.
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
            <h2 className={styles.sectionTitle}>Práctica para Todos los Niveles</h2>
            <p className={styles.sectionP}>
              Una vez superada la iniciación, podés sumarte a nuestros grupos regulares. Aquí te acompañamos en el perfeccionamiento de tu técnica, enfocándonos en mejorar el agrupado de tus flechas y alcanzar tu máximo potencial en un ambiente de compañerismo.
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
          <div className={styles.imgCol} style={{backgroundImage: "url('/images/generated-1777765463392.png')"}}></div>
        </div>
      </section>
      
      {/* Section 3: Regalá */}
      <section className={styles.sectionWhite}>
        <div className={styles.contentWrap}>
          <div className={styles.imgCol} style={{backgroundImage: "url('/images/generated-1777764819442.png')"}}></div>
          <div className={styles.textCol}>
            <h2 className={styles.sectionTitle}>Regalá una experiencia única</h2>
            <p className={styles.sectionP}>
              Sorprendé a alguien especial con una clase de arquería. Podés regalar una clase de iniciación o venir juntos para compartir este deporte milenario en un ambiente profesional y divertido.
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
