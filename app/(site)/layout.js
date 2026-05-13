import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSiteContent } from "@/utils/cms";

export default async function SiteLayout({ children }) {
  const content = await getSiteContent('home');
  
  return (
    <>
      <Navbar content={content.navbar} />
      <main style={{ minHeight: 'calc(100vh - 140px - 200px)' }}>
        {children}
      </main>
      <Footer content={content.footer} />
      <WhatsAppButton />
    </>
  );
}
