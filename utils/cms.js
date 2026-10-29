import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

// Plain supabase-js client — no cookie handling, safe inside unstable_cache.
// The site_content table is public data, no auth needed to read it.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// unstable_cache persists the result across requests and deployments for `revalidate` seconds.
// IMPORTANT: Throw on error or empty response inside unstable_cache so Vercel's persistent
// Data Cache never caches a failed/empty response if Supabase is temporarily unavailable.
const fetchSiteContent = unstable_cache(
  async (page) => {
    const { data, error } = await supabase
      .from('site_content')
      .select('section, key, content')
      .eq('page', page);

    if (error) {
      throw new Error(`Error fetching content for ${page}: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error(`Empty site_content returned for page: ${page}`);
    }

    // Transform array into nested object: { section: { key: content } }
    return data.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = {};
      acc[item.section][item.key] = item.content;
      return acc;
    }, {});
  },
  ['site_content_v2'], // bumped cache key to bust any empty {} cached during suspension
  {
    tags: ['site_content'],
    revalidate: 86400, // 24 hours
  }
);

export async function getSiteContent(page) {
  try {
    return await fetchSiteContent(page);
  } catch (err) {
    console.error('Error in getSiteContent:', err);
    return {};
  }
}
