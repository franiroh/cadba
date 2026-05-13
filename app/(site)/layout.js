import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 140px - 200px)' }}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
