import { getSiteContent } from '@/utils/cms';
import ContactForm from './ContactForm';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Contacto() {
  const content = await getSiteContent('contacto');

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
              <strong>Email:</strong> {content.info?.email}
            </div>
            <div className={styles.detailItem}>
              <strong>Teléfono:</strong> {content.info?.phone}
            </div>
            <div className={styles.detailItem}>
              <strong>Ubicación:</strong> {content.info?.location}
            </div>
          </div>
        </div>

        <div className={styles.formCol}>
          <ContactForm destinationEmail={content.general?.contact_email} />
        </div>
      </section>
    </div>
  );
}
