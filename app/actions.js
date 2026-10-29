"use server";

import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { put } from '@vercel/blob';

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { authorized: false, error: 'No autenticado.', supabase };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    return { authorized: false, error: 'Acceso denegado: se requiere rol de administrador.', supabase };
  }

  return { authorized: true, user, supabase };
}

export async function updateContent(id, newContent) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  if (!id || typeof newContent !== 'string') {
    return { success: false, error: 'Parámetros inválidos.' };
  }

  const { error } = await auth.supabase
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
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const file = formData.get('file');
  const rawPath = formData.get('path');

  if (!file || typeof file.arrayBuffer !== 'function') {
    return { success: false, error: 'Archivo inválido.' };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { success: false, error: 'Tipo de archivo no permitido. Solo se aceptan JPG, PNG, WEBP o GIF.' };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return { success: false, error: 'El archivo supera el tamaño máximo permitido (5 MB).' };
  }

  // Sanitize path to prevent path traversal or unexpected extensions
  const cleanPath = String(rawPath || '')
    .replace(/[^a-zA-Z0-9/_.-]/g, '')
    .replace(/\.+/g, '.');
  const ext = cleanPath.split('.').pop()?.toLowerCase();

  if (!cleanPath || cleanPath.includes('..') || !ALLOWED_EXTENSIONS.has(ext)) {
    return { success: false, error: 'Ruta o extensión de archivo inválida.' };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Vercel Blob — served via Vercel's global CDN, zero Supabase egress.
  const blob = await put(cleanPath, buffer, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return { success: true, url: blob.url };
}

export async function sendContactEmail(formData) {
  const name = String(formData.get('name') || '').trim().slice(0, 100);
  const email = String(formData.get('email') || '').trim().slice(0, 150);
  const message = String(formData.get('message') || '').trim().slice(0, 1500);
  const subject = String(formData.get('_subject') || 'Nuevo mensaje de contacto').trim().slice(0, 150);

  // Honeypot check — log the bot submission before returning fake success
  const honeypotValue = formData.get('_honey');
  if (honeypotValue) {
    try {
      const supabase = await createClient();
      await supabase.from('bot_submissions').insert([{
        name,
        email,
        message,
        honeypot_value: String(honeypotValue).slice(0, 200),
        source: subject,
      }]);
    } catch (_) {
      // Silently fail — never expose errors to bots
    }
    return { success: true }; // Fake success for bots
  }

  if (!name || !email || !message) {
    return { success: false, error: 'Todos los campos son obligatorios.' };
  }

  try {
    // Guardar en la base de datos de Supabase
    const supabase = await createClient();
    const { error: dbError } = await supabase.from('contact_messages').insert([{
      name,
      email,
      message,
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
