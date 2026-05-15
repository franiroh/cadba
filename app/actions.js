"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

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
    // 1. Guardar en la base de datos de Supabase
    const supabase = await createClient();
    const { error: dbError } = await supabase.from('contact_messages').insert([{
      name: name,
      email: email,
      message: message,
      source: subject
    }]);

    if (dbError) {
      console.error("Error guardando el mensaje en la base de datos:", dbError);
      // Opcional: decidimos continuar con el envío del email aunque falle la base de datos
    }

    // 2. Enviar email vía Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        name: name,
        email: email,
        message: message,
        subject: subject,
        from_name: "CAdBA Website"
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { success: false, error: result.message || "Error al enviar correo con Web3Forms" };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
