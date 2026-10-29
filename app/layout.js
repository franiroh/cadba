import Script from 'next/script';
import { getSiteContent } from "@/utils/cms";
import "./globals.css";

const SAFE_TAG_ID_REGEX = /^[A-Za-z0-9_-]+$/;
const SAFE_PIXEL_ID_REGEX = /^[0-9]+$/;

export async function generateMetadata() {
  const marketing = await getSiteContent('marketing');
  
  return {
    title: marketing.seo?.site_title || "CAdBA | Club de Arquería de Buenos Aires",
    description: marketing.seo?.site_description || "Club de Tiro con Arco en Buenos Aires. Un espacio para aprender y practicar con la guía de instructores certificados FATARCO.",
    icons: {
      icon: marketing.seo?.favicon || '/favicon.ico',
    }
  };
}

export default async function RootLayout({ children }) {
  const marketing = await getSiteContent('marketing');
  const gaId = SAFE_TAG_ID_REGEX.test(marketing.general?.ga_id || '') ? marketing.general.ga_id : null;
  const googleAdsId = SAFE_TAG_ID_REGEX.test(marketing.general?.google_ads_id || '') ? marketing.general.google_ads_id : null;
  const metaPixelId = SAFE_PIXEL_ID_REGEX.test(marketing.general?.meta_pixel_id || '') ? marketing.general.meta_pixel_id : null;
  
  return (
    <html lang="es">
      <head>
        {/* Google Analytics (gtag.js) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}

        {/* Google Ads */}
        {googleAdsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-ads-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleAdsId}');
                `,
              }}
            />
          </>
        )}

        {/* Meta Pixel */}
        {metaPixelId && (
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}

        {/* Custom Head Scripts */}
        {marketing.custom?.head_scripts && (
          <div dangerouslySetInnerHTML={{ __html: marketing.custom.head_scripts }} />
        )}
      </head>
      <body>
        {children}

        {/* Custom Body Scripts */}
        {marketing.custom?.body_scripts && (
          <div dangerouslySetInnerHTML={{ __html: marketing.custom.body_scripts }} />
        )}
      </body>
    </html>
  );
}
