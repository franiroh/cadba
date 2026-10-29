import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Only run Supabase Auth session refresh on /admin routes.
     * Public pages (/, /clases, /contacto, /gracias) do not use user sessions,
     * avoiding unnecessary Supabase Auth requests on every public pageview.
     */
    '/admin/:path*',
  ],
}
