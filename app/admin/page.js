"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { updateContent } from '@/app/actions';
import styles from './page.module.css';
import { Save, Image as ImageIcon, Layout, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Admin() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // id of item being saved

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('page', { ascending: true })
      .order('section', { ascending: true });
    
    if (error) console.error(error);
    else setContent(data);
    setLoading(false);
  }

  async function handleSave(id, value) {
    setSaving(id);
    const res = await updateContent(id, value);
    if (res.success) {
      // Show some feedback?
    }
    setSaving(null);
  }

  if (loading) return <div className={styles.loading}>Cargando editor...</div>;

  const pages = [...new Set(content.map(item => item.page))];

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/" className={styles.backBtn}><ArrowLeft size={16} /> Ver sitio</Link>
          <h1 className={styles.title}>Panel de Administración</h1>
        </div>
        <p className={styles.status}>Conectado a Supabase</p>
      </header>

      <main className={styles.main}>
        {pages.map(page => (
          <section key={page} className={styles.pageSection}>
            <h2 className={styles.pageTitle}><Layout size={20} /> Página: {page.toUpperCase()}</h2>
            
            <div className={styles.contentGrid}>
              {content.filter(item => item.page === page).map(item => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.sectionTag}>{item.section}</span>
                    <span className={styles.keyTag}>{item.key}</span>
                  </div>
                  
                  {item.content_type === 'text' ? (
                    <textarea 
                      className={styles.textarea}
                      defaultValue={item.content}
                      onBlur={(e) => {
                        if (e.target.value !== item.content) {
                          handleSave(item.id, e.target.value);
                        }
                      }}
                    />
                  ) : (
                    <div className={styles.imageEdit}>
                      <img src={item.content} alt={item.key} className={styles.previewImg} />
                      <div className={styles.imgInputGroup}>
                        <ImageIcon size={16} />
                        <input 
                          type="text" 
                          defaultValue={item.content}
                          className={styles.imgInput}
                          onBlur={(e) => handleSave(item.id, e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className={styles.cardFooter}>
                    {saving === item.id ? (
                      <span className={styles.saving}>Guardando...</span>
                    ) : (
                      <span className={styles.saved}>Autoguardado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
