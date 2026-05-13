"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Contacto() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate an API call or Server Action for the backend
    setTimeout(() => {
      router.push('/gracias');
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <section className={styles.formSection}>
        <div className={styles.infoCol}>
          <h1 className={styles.title}>Envianos tu consulta</h1>
          <p className={styles.subtitle}>
            Completá el formulario y nos pondremos en contacto contigo a la brevedad para asesorarte sobre nuestras clases y experiencias.
          </p>
          <div className={styles.contactDetails}>
            <div className={styles.detailItem}>
              <strong>Email:</strong> info@cadba.com.ar
            </div>
            <div className={styles.detailItem}>
              <strong>Ubicación:</strong> Buenos Aires, Argentina
            </div>
          </div>
        </div>

        <div className={styles.formCol}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Nombre Completo</label>
              <input type="text" id="name" required placeholder="Tu nombre" />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="email">Correo Electrónico</label>
              <input type="email" id="email" required placeholder="tu@email.com" />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="message">Mensaje</label>
              <textarea id="message" rows="5" required placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>
            
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
