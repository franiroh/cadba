import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import "./globals.css";

export const metadata = {
  title: "CAdBA - Club de Arqueros de Buenos Aires",
  description: "Club de Tiro con Arco en Buenos Aires. Un espacio para aprender y practicar con los mejores instructores.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 140px - 200px)' }}>
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
