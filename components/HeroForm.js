"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, MessageSquare, ArrowRight } from 'lucide-react';

export default function HeroForm({ destinationEmail, styles }) {
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
            _subject: "Nuevo mensaje de contacto rápido (Portada web)"
        })
      });
      
      if (response.ok) {
        router.push('/gracias');
      } else {
        throw new Error("FormSubmit requiere activación o captcha");
      }
    } catch (error) {
      console.warn("El envío AJAX falló. Redirigiendo a envío normal para activación de email...", error);
      const form = e.target;
      form.action = `https://formsubmit.co/${email}`;
      form.method = "POST";
      
      const subjectInput = document.createElement("input");
      subjectInput.type = "hidden";
      subjectInput.name = "_subject";
      subjectInput.value = "Nuevo mensaje de contacto rápido (Portada web)";
      form.appendChild(subjectInput);

      form.submit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.heroForm} onSubmit={handleSubmit}>
      <div className={styles.inputWrap}>
        <User size={18} className={styles.inputIcon} />
        <input type="text" name="name" placeholder="Nombre" className={styles.inputField} required />
      </div>
      <div className={styles.inputWrap}>
        <Mail size={18} className={styles.inputIcon} />
        <input type="email" name="email" placeholder="Email" className={styles.inputField} required />
      </div>
      <div className={styles.inputWrap}>
        <MessageSquare size={18} className={styles.inputIcon} />
        <textarea name="message" placeholder="Mensaje" className={styles.inputField} rows={3} required></textarea>
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
