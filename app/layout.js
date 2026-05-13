import Script from 'next/script';
import { getSiteContent } from "@/utils/cms";
import "./globals.css";

export const metadata = {
  title: "CAdBA - Club de Arqueros de Buenos Aires",
  description: "Club de Tiro con Arco en Buenos Aires. Un espacio para aprender y practicar con los mejores instructores.",
};

export default async function RootLayout({ children }) {
  const marketing = await getSiteContent('marketing');
  
  return (
    <html lang="es">
      <head>
        {/* Google Tag Manager - Head */}
        {marketing.general?.gtm_id && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${marketing.general.gtm_id}');
              `,
            }}
          />
        )}

        {/* Google Analytics (gtag.js) */}
        {marketing.general?.ga_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${marketing.general.ga_id}`}
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
                  gtag('config', '${marketing.general.ga_id}');
                `,
              }}
            />
          </>
        )}

        {/* Meta Pixel */}
        {marketing.general?.meta_pixel_id && (
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
                fbq('init', '${marketing.general.meta_pixel_id}');
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
        {/* Google Tag Manager (noscript) */}
        {marketing.general?.gtm_id && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${marketing.general.gtm_id}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {children}

        {/* Custom Body Scripts */}
        {marketing.custom?.body_scripts && (
          <div dangerouslySetInnerHTML={{ __html: marketing.custom.body_scripts }} />
        )}
      </body>
    </html>
  );
}
