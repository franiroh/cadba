import { unstable_cache } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

async function fetchSiteContent(page) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('section, key, content')
    .eq('page', page);

  if (error) {
    console.error('Error fetching content:', error);
    return {};
  }

  // Transform array into nested object: { section: { key: content } }
  return data.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = {};
    acc[item.section][item.key] = item.content;
    return acc;
  }, {});
}

export function getSiteContent(page) {
  return unstable_cache(
    () => fetchSiteContent(page),
    [`cms-${page}`],
    {
      revalidate: 300,        // refresca cada 5 minutos como máximo
      tags: [`cms-${page}`],  // permite revalidatePath/revalidateTag preciso
    }
  )();
}
