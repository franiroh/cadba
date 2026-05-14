"use client";

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { updateContent, uploadImage } from '@/app/actions';
import styles from './page.module.css';
import { Save, Image as ImageIcon, Layout, ArrowLeft, Home, BookOpen, Mail, Upload, Loader2, CheckCircle, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Admin() {
  const supabase = createClient();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const [saving, setSaving] = useState(null); // id of item being saved
  const [uploading, setUploading] = useState(null); // id of item being uploaded

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section', { ascending: true })
      .order('key', { ascending: true });
    
    if (error) console.error(error);
    else setContent(data);
    setLoading(false);
  }

  async function handleSave(id, value) {
    setSaving(id);
    const res = await updateContent(id, value);
    if (res.success) {
      setContent(prev => prev.map(item => item.id === id ? { ...item, content: value } : item));
    }
    setSaving(null);
  }

  async function handleImageUpload(e, item) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(item.id);
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Generate a clean path: page/section/filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${item.section}-${item.key}-${Date.now()}.${fileExt}`;
    const path = `${item.page}/${fileName}`;
    formData.append('path', path);

    const res = await uploadImage(formData);
    if (res.success) {
      await handleSave(item.id, res.url);
    }
    setUploading(null);
  }

  const keyLabels = {
    // Hero
    'hero/title_top': 'Frase Superior (Hero)',
    'hero/title_accent': 'Frase Destacada en Violeta (Hero)',
    'hero/title_bottom': 'Frase Inferior (Hero)',
    'hero/subtitle': 'Texto secundario (Hero)',
    'hero/image': 'Imagen de fondo (Hero)',
    'hero/location': 'Texto de Ubicación (Hero)',
    'hero/primary_btn': 'Texto Botón Reservar',
    'hero/primary_url': 'Link Botón Reservar',
    'hero/secondary_btn': 'Texto Botón Regalar',
    'hero/secondary_url': 'Link Botón Regalar',
    
    // Clases e Iniciación (Home)
    'clases/title': 'Título de la sección Clases',
    'clases/intro_subtitle': 'Subtítulo introducción',
    'clases/intro_text': 'Texto de introducción',
    'clases/card_title': 'Título de la tarjeta Iniciación',
    'clases/card_text': 'Texto de la tarjeta Iniciación',
    'clases/card_details': 'Lista de Detalles (Iniciación)',
    'clases/card_image': 'Imagen de la tarjeta Iniciación',
    'clases/card_url': 'Link de la tarjeta Iniciación',
    'clases/gift_title': 'Título de la tarjeta Regalo',
    'clases/gift_text': 'Texto de la tarjeta Regalo',
    'clases/gift_url': 'Link de la tarjeta Regalo',
    
    // Clases Page
    'clases/hero/title': 'Título Hero (Clases)',
    'clases/hero/subtitle': 'Subtítulo Hero (Clases)',
    'clases/hero/image': 'Imagen Hero (Clases)',
    'clases/iniciacion/title': 'Título: Iniciación',
    'clases/iniciacion/text': 'Descripción: Iniciación',
    'clases/iniciacion/details': 'Lista de Detalles (Iniciación)',
    'clases/iniciacion/image': 'Foto: Iniciación',
    'clases/iniciacion/btn_text': 'Texto Botón (Iniciación)',
    'clases/iniciacion/btn_url': 'Link Botón (Iniciación)',
    'clases/practica/title': 'Título: Práctica',
    'clases/practica/text': 'Descripción: Práctica',
    'clases/practica/details': 'Lista de Detalles (Práctica)',
    'clases/practica/image': 'Foto: Práctica',
    'clases/practica/btn_text': 'Texto Botón (Práctica)',
    'clases/practica/btn_url': 'Link Botón (Práctica)',
    'clases/gift/title': 'Título: Gift Card',
    'clases/gift/text': 'Descripción: Gift Card',
    'clases/gift/details': 'Lista de Detalles (Gift Card)',
    'clases/gift/image': 'Foto: Gift Card',
    'clases/gift/btn_text': 'Texto Botón (Gift Card)',
    'clases/gift/btn_url': 'Link Botón (Gift Card)',
    
    // Estilos (Home)
    'estilos/title': 'Título de la sección Estilos',
    'estilos/subtitle': 'Introducción a los estilos',
    'estilos/tradicional_title': 'Nombre: Estilo Tradicional',
    'estilos/tradicional_desc': 'Descripción: Estilo Tradicional',
    'estilos/tradicional_image': 'Foto: Tradicional',
    'estilos/recurvo_title': 'Nombre: Estilo Recurvo',
    'estilos/recurvo_desc': 'Descripción: Estilo Recurvo',
    'estilos/recurvo_image': 'Foto: Recurvo',
    'estilos/compuesto_title': 'Nombre: Estilo Compuesto',
    'estilos/compuesto_desc': 'Descripción: Estilo Compuesto',
    'estilos/compuesto_image': 'Foto: Compuesto',
    'estilos/raso_title': 'Nombre: Estilo Raso',
    'estilos/raso_desc': 'Descripción: Estilo Raso',
    'estilos/raso_image': 'Foto: Raso',
    
    // Info / Contacto
    'info/title': 'Título de la sección Ubicación',
    'info/location': 'Dirección Principal',
    'info/email': 'Email de Contacto',
    'info/hours': 'Horarios de Atención',
    'info/phone': 'Teléfono / WhatsApp',
    'info/label_hours': 'Etiqueta: Horarios',
    'info/label_location': 'Etiqueta: Dirección',
    'info/label_phone': 'Etiqueta: Teléfono',
    
    // Footer
    'footer/address_line1': 'Dirección (Línea 1)',
    'footer/address_line2': 'Dirección (Línea 2)',
    'footer/instagram': 'Usuario de Instagram',
    'footer/phone': 'Teléfono / WhatsApp',
    'footer/hours': 'Horarios de atención',
    
    // Contacto Page
    'contacto/hero/title': 'Título de la página (Contacto)',
    'contacto/info/email': 'Email mostrado',
    'contacto/info/location': 'Ubicación mostrada',
    'contacto/info/phone': 'Teléfono mostrado',
    
    // Gracias Page (dentro de Contacto)
    'contacto/gracias/title': 'Título (Página de Gracias)',
    'contacto/gracias/subtitle': 'Mensaje (Página de Gracias)',
    'contacto/gracias/btn_text': 'Botón (Página de Gracias)',
    
    // Marketing
    'marketing/general/ga_id': 'Google Analytics ID (G-XXXXX)',
    'marketing/general/gtm_id': 'Google Tag Manager ID (GTM-XXXXX)',
    'marketing/general/meta_pixel_id': 'Meta Pixel ID',
    'marketing/custom/head_scripts': 'Scripts Personalizados (Head)',
    'marketing/custom/body_scripts': 'Scripts Personalizados (Body)',
    
    // Configuración General (Dentro de Contacto)
    'contacto/general/contact_email': 'Email de Recepción de Formularios',
    
    // Navbar
    'navbar/btn_text': 'Botón Menú (Texto)',
    'navbar/btn_url': 'Botón Menú (Link)',
    
    // WhatsApp
    'whatsapp/phone': 'Número de WhatsApp (con código de país)',
    'whatsapp/message': 'Mensaje Pre-escrito',
    'whatsapp/label': 'Texto del Botón Flotante',
  };

  const sectionLabels = {
    'navbar': '0. Navegación (Global)',
    'whatsapp': 'Botón de WhatsApp',
    'hero': '1. Portada / Hero',
    'iniciacion': '2. Iniciación',
    'practica': '3. Práctica Regular',
    'gift': '4. Experiencia de Regalo (Gift Card)',
    'clases': 'Clases e Iniciación (Home)',
    'estilos': 'Estilos de Arquería (Home)',
    'info': 'Ubicación y Contacto (Home)',
    'footer': 'Pie de Página (Footer)',
    'gracias': 'Página de Éxito (Gracias)',
    'general': 'Configuración General',
    'custom': 'Scripts Personalizados'
  };

  const sectionOrder = ['general', 'navbar', 'whatsapp', 'hero', 'iniciacion', 'practica', 'gift', 'clases', 'estilos', 'info', 'gracias', 'custom', 'footer'];

  const keyOrder = [
    'title_top', 'title_accent', 'title_bottom', 'title', 'intro_subtitle', 'intro_text', 'subtitle', 'image',
    'card_title', 'card_text', 'card_details', 'card_image', 'card_url',
    'gift_title', 'gift_text', 'gift_url', 'gift_details', 'gift_image',
    'tradicional_title', 'tradicional_desc', 'tradicional_image',
    'recurvo_title', 'recurvo_desc', 'recurvo_image',
    'compuesto_title', 'compuesto_desc', 'compuesto_image',
    'raso_title', 'raso_desc', 'raso_image',
    'label_location', 'location', 'label_hours', 'hours', 'label_phone', 'phone', 'email',
    'primary_btn', 'primary_url', 'secondary_btn', 'secondary_url', 
    'text', 'details', 'btn_text', 'btn_url',
    'contact_email', 'ga_id', 'gtm_id', 'meta_pixel_id', 'head_scripts', 'body_scripts'
  ];

  if (loading) return <div className={styles.loading}><Loader2 className={styles.spin} /> Cargando panel...</div>;

  const filteredContent = content.filter(item => item.page === activePage);
  
  // Sort sections according to sectionOrder
  const sections = [...new Set(filteredContent.map(item => item.section))]
    .sort((a, b) => {
      const indexA = sectionOrder.indexOf(a);
      const indexB = sectionOrder.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  // Function to sort keys within a section
  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      const indexA = keyOrder.indexOf(a.key);
      const indexB = keyOrder.indexOf(b.key);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.key.localeCompare(b.key);
    });
  };

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>CAdBA CMS</div>
          <p className={styles.sidebarSubtitle}>Gestión de Contenidos</p>
        </div>
        
        <nav className={styles.nav}>
          <div className={styles.navGroupLabel}>Páginas</div>
          <button 
            className={`${styles.navLink} ${activePage === 'home' ? styles.activeNavLink : ''}`}
            onClick={() => setActivePage('home')}
          >
            <Home size={18} /> Inicio (Home)
          </button>
          <button 
            className={`${styles.navLink} ${activePage === 'clases' ? styles.activeNavLink : ''}`}
            onClick={() => setActivePage('clases')}
          >
            <BookOpen size={18} /> Clases
          </button>
          <button 
            className={`${styles.navLink} ${activePage === 'contacto' ? styles.activeNavLink : ''}`}
            onClick={() => setActivePage('contacto')}
          >
            <Mail size={18} /> Contacto
          </button>
          <button 
            className={`${styles.navLink} ${activePage === 'marketing' ? styles.activeNavLink : ''}`}
            onClick={() => setActivePage('marketing')}
          >
            <Shield size={18} /> Marketing & Tracking
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backBtn}><ArrowLeft size={16} /> Ver sitio público</Link>
        </div>
      </aside>

      <div className={styles.mainWrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {activePage === 'home' ? 'Editando: Página de Inicio' : 
             activePage === 'clases' ? 'Editando: Página de Clases' : 
             activePage === 'contacto' ? 'Editando: Página de Contacto' : 'Marketing & Tracking'}
          </h1>
          <div className={styles.status}>Base de Datos: Online</div>
        </header>

        <main className={styles.content}>
          {sections.length > 0 ? (
            sections.map(section => (
              <section key={section} className={styles.pageSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionIcon}><Layout size={20} /></div>
                  <h2 className={styles.sectionTitle}>{sectionLabels[section] || section}</h2>
                </div>
                
                <div className={styles.contentGrid}>
                  {sortItems(filteredContent.filter(item => item.section === section)).map(item => (
                    <div key={item.id} className={`${styles.card} ${item.key.startsWith('title_') ? styles.fullWidth : ''}`}>
                      <div className={styles.cardHeader}>
                        <div className={styles.labelGroup}>
                          <span className={styles.fieldLabel}>{keyLabels[`${item.page}/${item.section}/${item.key}`] || keyLabels[`${item.section}/${item.key}`] || keyLabels[item.key] || 'Campo'}</span>
                          <code className={styles.fieldKey}>{item.key}</code>
                        </div>
                        <div className={styles.saveStatus}>
                          {saving === item.id ? (
                            <span className={styles.saving}><Loader2 size={12} className={styles.spin} /> Guardando...</span>
                          ) : (
                            <span className={styles.saved}><CheckCircle size={12} /> Guardado</span>
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.cardBody}>
                        {item.content_type === 'text' ? (
                          <textarea 
                            className={styles.textarea}
                            defaultValue={item.content}
                            onBlur={(e) => {
                              if (e.target.value !== item.content) {
                                handleSave(item.id, e.target.value);
                              }
                            }}
                            placeholder={`Ingresá el texto para ${keyLabels[item.key] || item.key}...`}
                          />
                        ) : (
                          <div className={styles.imageEdit}>
                            <div className={styles.previewContainer}>
                              <img src={item.content} alt={item.key} className={styles.previewImg} />
                              <div className={styles.imageInfo}>
                                <ImageIcon size={14} /> <span>{item.content.split('/').pop()}</span>
                              </div>
                            </div>
                            
                            <div className={styles.imageMeta}>
                              <div className={styles.dimensionBadge}>
                                Medida recomendada: {
                                  (item.section === 'hero' && item.key === 'image') ? '1920x1080px' :
                                  (item.section === 'clases' && item.key === 'card_image') ? '800x600px' :
                                  item.key.includes('image') ? '800x600px' : 'Libre'
                                }
                              </div>
                            </div>

                            <label className={styles.uploadBtn}>
                              <Upload size={16} />
                              <span>{uploading === item.id ? 'Subiendo...' : 'Cambiar Imagen'}</span>
                              <input 
                                type="file" 
                                className={styles.hiddenInput} 
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, item)}
                                disabled={uploading === item.id}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className={styles.empty}>
              <Loader2 className={styles.spin} size={48} />
              <p>Sincronizando con Supabase...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
