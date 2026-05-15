"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { sendContactEmail } from '@/app/actions';

export default function HeroForm({ destinationEmail, styles }) {
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
      formData.append('_subject', "Nuevo mensaje de contacto rápido (Portada web)");

      const result = await sendContactEmail(formData);
      
      if (result.success) {
        router.push('/gracias');
      } else {
        alert("Hubo un error al enviar el mensaje: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error de conexión al enviar el correo. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.heroForm} onSubmit={handleSubmit}>
      {/* Honeypot field para evitar bots */}
      <input type="text" name="_honey" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
      
      <div className={styles.inputWrap}>
        <User size={18} className={styles.inputIcon} />
        <input type="text" name="name" placeholder="Nombre" className={styles.inputField} required maxLength="100" />
      </div>
      <div className={styles.inputWrap}>
        <Mail size={18} className={styles.inputIcon} />
        <input type="email" name="email" placeholder="Email" className={styles.inputField} required maxLength="150" />
      </div>
      <div className={styles.inputWrap}>
        <MessageSquare size={18} className={styles.inputIcon} />
        <textarea name="message" placeholder="Mensaje" className={styles.inputField} rows={3} required maxLength="1500"></textarea>
      </div>
      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : (
          <>
            Enviar consulta <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}
