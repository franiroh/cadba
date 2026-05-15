"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function updateContent(id, newContent) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('site_content')
    .update({ content: newContent, updated_at: new Date() })
    .eq('id', id);

  if (error) {
    console.error('Error updating content:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/clases');
  return { success: true };
}

export async function uploadImage(formData) {
  const supabase = await createClient();
  const file = formData.get('file');
  const path = formData.get('path'); // e.g. "home/hero/bg.png"
  
  const arrayBuffer = await file.arrayBuffer();

  const { data, error } = await supabase.storage
    .from('site-assets')
    .upload(path, arrayBuffer, { 
      upsert: true,
      contentType: file.type
    });

  if (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('site-assets')
    .getPublicUrl(path);

  return { success: true, url: publicUrl };
}

export async function sendContactEmail(formData) {
  // Honeypot check
  if (formData.get('_honey')) {
    return { success: true }; // Fake success for bots
  }

  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  const subject = formData.get('_subject') || 'Nuevo mensaje de contacto';
  const destinationEmail = formData.get('destinationEmail');

  try {
    const data = await resend.emails.send({
      from: 'CAdBA <onboarding@resend.dev>', // Dominio de prueba, cuando verifiques tu dominio podés cambiarlo a ej: hola@cadba.com.ar
      to: destinationEmail,
      subject: subject,
      replyTo: email,
      html: `
        <h2>${subject}</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email (Remitente):</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });

    if (data.error) {
      return { success: false, error: data.error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
