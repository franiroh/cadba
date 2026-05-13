"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function ContactForm({ destinationEmail }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = destinationEmail || 'tu-email@ejemplo.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value,
            _subject: "Nuevo mensaje de contacto web"
        })
      });
      
      if (response.ok) {
        router.push('/gracias');
      } else {
        alert("Hubo un error al enviar el mensaje. Por favor intenta de nuevo.");
      }
    } catch (error) {
      alert("Hubo un error de conexión. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
      
      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
      </button>
    </form>
  );
}
