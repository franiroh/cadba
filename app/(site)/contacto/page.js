import { getSiteContent } from '@/utils/cms';
import { obfuscateText } from '@/utils/obfuscate';
import ProtectedText from '@/components/ProtectedText';
import ContactForm from './ContactForm';
import styles from './page.module.css';

export const revalidate = 86400;

export default async function Contacto() {
  const content = await getSiteContent('contacto');
  const encodedEmail = obfuscateText(content.info?.email);
  const encodedPhone = obfuscateText(content.info?.phone);

  return (
    <div className={styles.container}>
      <section className={styles.formSection}>
        <div className={styles.infoCol}>
          <h1 className={styles.title}>{content.hero?.title}</h1>
          <p className={styles.subtitle}>
            {content.hero?.subtitle}
          </p>
          <div className={styles.contactDetails}>
            <div className={styles.detailItem}>
              <strong>Email:</strong> <ProtectedText encoded={encodedEmail} />
            </div>
            <div className={styles.detailItem}>
              <strong>Teléfono:</strong> <ProtectedText encoded={encodedPhone} />
            </div>
            <div className={styles.detailItem}>
              <strong>Ubicación:</strong> {content.info?.location}
            </div>
          </div>
        </div>

        <div className={styles.formCol}>
          <ContactForm web3formsKey={content.general?.web3forms_key} />
        </div>
      </section>
    </div>
  );
}
