"use server";

import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { put } from '@vercel/blob';

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

  revalidateTag('site_content', 'max');
  revalidatePath('/');
  revalidatePath('/clases');
  revalidatePath('/contacto');
  revalidatePath('/gracias');
  return { success: true };
}

export async function uploadImage(formData) {
  const file = formData.get('file');
  const path = formData.get('path'); // e.g. "home/hero-image-123.png"

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Vercel Blob — served via Vercel's global CDN, zero Supabase egress.
  const blob = await put(path, buffer, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return { success: true, url: blob.url };
}

export async function sendContactEmail(formData) {
  // Honeypot check — log the bot submission before returning fake success
  const honeypotValue = formData.get('_honey');
  if (honeypotValue) {
    try {
      const supabase = await createClient();
      await supabase.from('bot_submissions').insert([{
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        honeypot_value: honeypotValue,
        source: formData.get('_subject') || 'contacto',
      }]);
    } catch (_) {
      // Silently fail — never expose errors to bots
    }
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
      return { success: false, error: dbError.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
