import Script from 'next/script';
import { getSiteContent } from "@/utils/cms";
import "./globals.css";

export const metadata = {
  title: "CAdBA | Club de Arquería de Buenos Aires",
  description: "Club de Tiro con Arco en Buenos Aires. Un espacio para aprender y practicar con la guía de instructores certificados FATARCO.",
};

export default async function RootLayout({ children }) {
  const marketing = await getSiteContent('marketing');
  
  return (
    <html lang="es">
      <head>
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
        {children}

        {/* Custom Body Scripts */}
        {marketing.custom?.body_scripts && (
          <div dangerouslySetInnerHTML={{ __html: marketing.custom.body_scripts }} />
        )}
      </body>
    </html>
  );
}
