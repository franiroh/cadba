"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function ContactForm({ destinationEmail }) {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const email = destinationEmail || 'tu-email@ejemplo.com';

  return (
    <form className={styles.form} action={`https://formsubmit.co/${email}`} method="POST">
      <input type="hidden" name="_next" value={`${origin}/gracias`} />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_subject" value="Nuevo mensaje de contacto desde la web de CAdBA" />

      <div className={styles.inputGroup}>
        <label htmlFor="name">Nombre Completo</label>
        <input type="text" id="name" name="name" required placeholder="Tu nombre" />
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="email">Correo Electrónico</label>
        <input type="email" id="email" name="email" required placeholder="tu@email.com" />
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="message">Mensaje</label>
        <textarea id="message" name="message" rows="5" required placeholder="¿En qué podemos ayudarte?"></textarea>
      </div>
      
      <button type="submit" className={styles.submitBtn}>
        Enviar consulta
      </button>
    </form>
  );
}
