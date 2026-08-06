import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

// Plain supabase-js client — no cookie handling, safe inside unstable_cache.
// The site_content table is public data, no auth needed to read it.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// unstable_cache persists the result across requests for `revalidate` seconds.
// This means Supabase is only queried once per day per page, regardless of how
// many visitors hit the site — dramatically reducing egress usage.
const fetchSiteContent = unstable_cache(
  async (page) => {
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
  },
  ['site_content'], // cache key prefix
  {
    tags: ['site_content'],
    revalidate: 86400, // 24 hours
  }
);

export function getSiteContent(page) {
  return fetchSiteContent(page);
}

