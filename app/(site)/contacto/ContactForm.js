"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendContactEmail } from '@/app/actions';
import styles from './page.module.css';

export default function ContactForm({ destinationEmail }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = destinationEmail || 'tu-email@ejemplo.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Honeypot check manual por las dudas
    if (e.target._honey.value) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(e.target);
      formData.append('destinationEmail', email);
      formData.append('_subject', "Nuevo mensaje de contacto web");

      const result = await sendContactEmail(formData);
      
      // 2. Enviar email vía Web3Forms directo desde el cliente
      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "632e8ec5-a7bb-4d5e-8e48-8cb662ce525f",
          name: e.target.name.value,
          email: e.target.email.value,
          message: e.target.message.value,
          subject: "Nuevo mensaje de contacto web",
          from_name: "CAdBA Website"
        }),
      });

      const web3Data = await web3Response.json();
      
      if (web3Data.success) {
        router.push('/gracias');
      } else {
        alert("Hubo un error al enviar el mensaje: " + (web3Data.message || "Revisá tu conexión."));
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error de conexión al enviar el correo. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Honeypot field para evitar bots */}
      <input type="text" name="_honey" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

      <div className={styles.inputGroup}>
        <label htmlFor="name">Nombre Completo</label>
        <input type="text" id="name" name="name" required placeholder="Tu nombre" maxLength="100" />
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="email">Correo Electrónico</label>
        <input type="email" id="email" name="email" required placeholder="tu@email.com" maxLength="150" />
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="message">Mensaje</label>
        <textarea id="message" name="message" rows="5" required placeholder="¿En qué podemos ayudarte?" maxLength="1500"></textarea>
      </div>
      
      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
      </button>
    </form>
  );
}
