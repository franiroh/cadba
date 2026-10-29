import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSiteContent } from "@/utils/cms";
import { obfuscateText } from "@/utils/obfuscate";

export default async function SiteLayout({ children }) {
  const content = await getSiteContent('home');

  const safeFooterContent = content.footer
    ? {
        ...content.footer,
        phone: undefined,
        encodedPhone: obfuscateText(content.footer.phone),
      }
    : null;

  const safeWhatsAppContent = content.whatsapp
    ? {
        ...content.whatsapp,
        phone: undefined,
        encodedPhone: obfuscateText(content.whatsapp.phone),
      }
    : null;
  
  return (
    <>
      <Navbar content={content.navbar} />
      <main style={{ minHeight: 'calc(100vh - 140px - 200px)' }}>
        {children}
      </main>
      <Footer content={safeFooterContent} />
      <WhatsAppButton content={safeWhatsAppContent} />
    </>
  );
}
