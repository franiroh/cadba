"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { sendContactEmail } from '@/app/actions';

export default function HeroForm({ destinationEmail, submitText, styles }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = destinationEmail || 'tu-email@ejemplo.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Honeypot check manual por las dudas
    if (e.target._honey.value) {
      // Simular éxito para el bot, pero sin enviar el correo ni redirigir a /gracias
      // Esto evita que las campañas (Google Ads, Meta) lo cuenten como conversión.
      e.target.reset();
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(e.target);
      formData.append('destinationEmail', email);
      formData.append('_subject', "Nuevo mensaje de contacto rápido (Portada web)");

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
          subject: "Nuevo mensaje de contacto rápido (Portada web)",
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
            {submitText || 'Enviar consulta'} <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}
