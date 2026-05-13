"use server";

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

export async function updateContent(id, newContent) {
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
  const file = formData.get('file');
  const path = formData.get('path'); // e.g. "home/hero/bg.png"
  
  const { data, error } = await supabase.storage
    .from('site-assets')
    .upload(path, file, { upsert: true });

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
