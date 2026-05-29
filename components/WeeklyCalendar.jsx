"use client";

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, Download, Clock, User, Calendar, Sliders, AlertCircle, Info, Copy, Loader2 } from 'lucide-react';
import styles from './WeeklyCalendar.module.css';

// Preset color options designed to look premium and guarantee great contrast
const PRESET_COLORS = [
  { name: 'CAdBA Violeta', bg: '#7060ab', text: '#ffffff' },
  { name: 'CAdBA Turquesa', bg: '#07cebb', text: '#0c2c27' },
  { name: 'Azul Deportivo', bg: '#3b82f6', text: '#ffffff' },
  { name: 'Esmeralda', bg: '#059669', text: '#ffffff' },
  { name: 'Ámbar Cálido', bg: '#d97706', text: '#ffffff' },
  { name: 'Rosa Coral', bg: '#e11d48', text: '#ffffff' },
  { name: 'Gris Carbón', bg: '#475569', text: '#ffffff' }
];

const DAYS_OF_WEEK = [
  { id: 1, label: 'Lunes' },
  { id: 2, label: 'Martes' },
  { id: 3, label: 'Miércoles' },
  { id: 4, label: 'Jueves' },
  { id: 5, label: 'Viernes' },
  { id: 6, label: 'Sábado' },
  { id: 7, label: 'Domingo' }
];

export default function WeeklyCalendar({ scheduleItem, handleSave }) {
  // 1. Local States
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    day: 1,
    startTime: '18:00',
    endTime: '19:30',
    coach: '',
    color: '#7060ab',
    textColor: '#ffffff'
  });
  
  const [editingId, setEditingId] = useState(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [gridStartHour, setGridStartHour] = useState(8);
  const [gridEndHour, setGridEndHour] = useState(21);
  const [mainTitle, setMainTitle] = useState('CLUB DE ARQUEROS DE BUENOS AIRES');
  const [subTitle, setSubTitle] = useState('CRONOGRAMA DE CLASES Y HORARIOS SEMANALES');
  const [footerText, setFooterText] = useState('Av. Vélez Sarsfield 268, Barracas, CABA');
  const [errorMsg, setErrorMsg] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isEditingMainTitle, setIsEditingMainTitle] = useState(false);
  const [isEditingSubTitle, setIsEditingSubTitle] = useState(false);
  const [isEditingFooter, setIsEditingFooter] = useState(false);

  // Helper: persistent save with visual spinner
  const saveSchedule = async (
    updatedList,
    updatedMain = mainTitle,
    updatedSub = subTitle,
    updatedFooter = footerText,
    updatedStartHour = gridStartHour,
    updatedEndHour = gridEndHour
  ) => {
    setIsSaving(true);
    const payload = {
      mainTitle: updatedMain,
      subTitle: updatedSub,
      footerText: updatedFooter,
      gridStartHour: updatedStartHour,
      gridEndHour: updatedEndHour,
      classes: updatedList
    };
    await handleSave(scheduleItem.id, JSON.stringify(payload));
    setTimeout(() => setIsSaving(false), 800);
  };

  // Hidden Canvas Ref for image exporting
  const canvasRef = useRef(null);

  // 2. Load classes from DB on Mount / update
  useEffect(() => {
    setIsClient(true);
    if (scheduleItem && scheduleItem.content) {
      try {
        const parsed = JSON.parse(scheduleItem.content);
        let loadedClasses = [];
        let loadedMainTitle = 'CLUB DE ARQUEROS DE BUENOS AIRES';
        let loadedSubTitle = 'CRONOGRAMA DE CLASES Y HORARIOS SEMANALES';
        let loadedFooterText = 'Av. Vélez Sarsfield 268, Barracas, CABA';
        let loadedStartHour = null;
        let loadedEndHour = null;

        if (Array.isArray(parsed)) {
          loadedClasses = parsed;
        } else if (parsed && typeof parsed === 'object') {
          loadedClasses = parsed.classes || [];
          if (parsed.mainTitle !== undefined || parsed.subTitle !== undefined) {
            loadedMainTitle = parsed.mainTitle || 'CLUB DE ARQUEROS DE BUENOS AIRES';
            loadedSubTitle = parsed.subTitle || 'CRONOGRAMA DE CLASES Y HORARIOS SEMANALES';
          } else if (parsed.title) {
            loadedSubTitle = parsed.title;
          }
          loadedFooterText = parsed.footerText || 'Av. Vélez Sarsfield 268, Barracas, CABA';
          // Restore saved grid hours if present
          if (parsed.gridStartHour !== undefined) loadedStartHour = parsed.gridStartHour;
          if (parsed.gridEndHour !== undefined)   loadedEndHour   = parsed.gridEndHour;
        }

        setClasses(loadedClasses);
        setMainTitle(loadedMainTitle);
        setSubTitle(loadedSubTitle);
        setFooterText(loadedFooterText);

        if (loadedStartHour !== null && loadedEndHour !== null) {
          // Use the user's saved scale
          setGridStartHour(loadedStartHour);
          setGridEndHour(loadedEndHour);
        } else if (loadedClasses.length > 0) {
          // Fallback: auto-detect from class times (first load, no saved value yet)
          let minH = 24, maxH = 0;
          loadedClasses.forEach(c => {
            const startH = parseInt(c.startTime.split(':')[0]);
            const endH = Math.ceil(parseFloat(c.endTime.split(':')[0]) + parseFloat(c.endTime.split(':')[1] || 0) / 60);
            if (startH < minH) minH = startH;
            if (endH > maxH) maxH = endH;
          });
          setGridStartHour(Math.max(0, Math.min(8, minH - 1)));
          setGridEndHour(Math.min(24, Math.max(21, maxH + 1)));
        }
      } catch (e) {
        console.error('Error parsing weekly schedule:', e);
        setClasses([]);
      }
    }
  }, [scheduleItem]);

  if (!isClient) return null;

  // 3. Helper: Convert time string ("HH:MM") to decimal hours (e.g. "09:30" -> 9.5)
  const timeToDecimal = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h + (m || 0) / 60;
  };

  // 4. Form Submission (Add/Edit Class)
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!formData.title.trim()) {
      setErrorMsg('Por favor ingresá un título o nombre de clase.');
      return;
    }

    const startDec = timeToDecimal(formData.startTime);
    const endDec = timeToDecimal(formData.endTime);

    if (endDec <= startDec) {
      setErrorMsg('La hora de fin debe ser posterior a la de inicio.');
      return;
    }

    let updatedClasses;
    if (editingId) {
      // Edit mode
      updatedClasses = classes.map(c => c.id === editingId ? { ...formData, id: editingId } : c);
      setEditingId(null);
    } else {
      // Add or Duplicate mode
      const newClass = {
        ...formData,
        id: Date.now().toString()
      };
      updatedClasses = [...classes, newClass];
      setIsDuplicating(false);
    }

    // Save state and persist to Supabase
    setClasses(updatedClasses);
    saveSchedule(updatedClasses);

    // Reset Form
    resetForm();
  };

  // Reset Form fields
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      day: 1,
      startTime: '18:00',
      endTime: '19:30',
      coach: '',
      color: '#7060ab',
      textColor: '#ffffff'
    });
    setEditingId(null);
    setIsDuplicating(false);
    setErrorMsg('');
  };

  // Load class to edit
  const handleEdit = (cls) => {
    setFormData(cls);
    setEditingId(cls.id);
    setIsDuplicating(false);
    setErrorMsg('');
  };

  // Load class to duplicate
  const handleDuplicate = (cls) => {
    setFormData({
      ...cls,
      id: '', // clear ID so it saves as a new class
    });
    setEditingId(null);
    setIsDuplicating(true);
    setErrorMsg('');
  };

  // Delete class
  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que querés eliminar esta clase de la grilla?')) {
      const updatedClasses = classes.filter(c => c.id !== id);
      setClasses(updatedClasses);
      saveSchedule(updatedClasses);
      if (editingId === id) {
        resetForm();
      }
    }
  };

  // Handle Preset Color Pick
  const handleColorSelect = (preset) => {
    setFormData(prev => ({
      ...prev,
      color: preset.bg,
      textColor: preset.text
    }));
  };

  // 5. Canvas Drawing & JPG Export Logic
  const exportToJpg = (theme = 'dark') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Configs
    // ── Canvas dimensions ───────────────────────────────────────────────
    //   Zone layout (Y coordinates):
    //     0   –   8  : Turquoise accent bar
    //    20   – 190  : Branding / header  (170px tall)
    //   195   – 245  : Day-of-week labels (50px tall)
    //   245   – 860  : Calendar grid      (615px tall)
    //   860   – 900  : Footer             (40px)
    // ────────────────────────────────────────────────────────────────────
    const W = 1400;
    const H = 900;
    canvas.width = W;
    canvas.height = H;

    const isDark = theme === 'dark';
    const bgColor      = isDark ? '#1a1b26' : '#ffffff';
    const textColorPrimary   = isDark ? '#ffffff'  : '#1e293b';
    const textColorSecondary = isDark ? '#a9b1d6'  : '#64748b';
    const textColorMuted     = isDark ? '#565f89'  : '#94a3b8';
    const headerBgColor      = isDark ? '#24283b'  : '#f8fafc';
    const dayBgColor         = isDark ? '#1e2236'  : '#f1f5f9';
    const gridLineColor      = isDark ? '#2f334d'  : '#e2e8f0';
    const hourLineColor      = isDark ? '#24283b'  : '#f1f5f9';

    // Fixed Y landmarks
    const ACCENT_H    =   8;   // top turquoise bar height
    const HEADER_Y    =  20;   // branding zone top
    const HEADER_H    = 170;   // branding zone height
    const DAY_Y       = HEADER_Y + HEADER_H;   // 190 – day labels zone top
    const DAY_H       =  50;   // day labels zone height
    const GRID_Y      = DAY_Y  + DAY_H;        // 240 – calendar grid top
    const FOOTER_Y    = H - 40;                // footer text Y
    const GRID_H      = FOOTER_Y - 20 - GRID_Y; // calendar grid height

    const LEFT_PAD    = 140;  // space for hour labels on the left
    const RIGHT_PAD   =  60;
    const gridW       = W - LEFT_PAD - RIGHT_PAD;
    const colW        = gridW / 7;
    const totalHours  = gridEndHour - gridStartHour;
    const rowH        = GRID_H / totalHours;

    const logoImg = new Image();
    const logoSrc = theme === 'dark' ? '/images/logo-blanco.png' : '/images/logo.png';

    const drawAll = (loadedLogo) => {
      // ── Palette (matches site globals.css) ───────────────────────────
      const PURPLE       = '#7060ab';
      const PURPLE_DARK  = '#5d4d9b';
      const TEAL         = '#07cebb';
      const BG           = isDark ? '#110e18' : '#ffffff';
      const HEADER_BG    = isDark ? '#1c1728' : '#f5f2ff'; // light purple tint
      const DAY_BAR_BG   = isDark ? '#1a1630' : '#ede9fb'; // slightly deeper purple tint
      const DAY_TEXT     = isDark ? '#c4b8e8' : PURPLE;
      const GRID_BG      = isDark ? '#13101f' : '#fdfcff';
      const GRID_LINE    = isDark ? '#2d2540' : '#e8e4f3';
      const HOUR_LINE    = isDark ? '#1c1728' : '#f1ecff';
      const HOUR_TEXT    = isDark ? '#7060ab' : '#9b8ec4';
      const TITLE_COLOR  = isDark ? '#ffffff'  : '#1e293b';
      const SUB_COLOR    = isDark ? '#07cebb'  : TEAL;
      const FOOT_COLOR   = isDark ? '#7060ab'  : '#9b8ec4';
      const TIME_COL_BG  = isDark ? '#1a1630'  : '#f8f5ff';

      // ── A. Full background ───────────────────────────────────────────
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      // ── B. Top accent bar (turquoise) ────────────────────────────────
      ctx.fillStyle = TEAL;
      ctx.fillRect(0, 0, W, ACCENT_H);

      // ── C. Header zone ───────────────────────────────────────────────
      // Background
      ctx.fillStyle = HEADER_BG;
      ctx.fillRect(0, HEADER_Y, W, HEADER_H);

      // Left accent stripe (purple → turquoise gradient)
      const grad = ctx.createLinearGradient(0, HEADER_Y, 0, HEADER_Y + HEADER_H);
      grad.addColorStop(0, PURPLE);
      grad.addColorStop(1, TEAL);
      ctx.fillStyle = grad;
      ctx.fillRect(0, HEADER_Y, 6, HEADER_H);

      // Logo
      const maxLogoH = HEADER_H - 20;
      const logoX    = LEFT_PAD;
      const logoY    = HEADER_Y + 10;
      let drawnLogoW = 0;

      if (loadedLogo) {
        try {
          const aspectRatio = loadedLogo.naturalWidth / loadedLogo.naturalHeight;
          const logoDrawH   = maxLogoH;
          const logoDrawW   = logoDrawH * aspectRatio;
          ctx.drawImage(loadedLogo, logoX, logoY, logoDrawW, logoDrawH);
          drawnLogoW = logoDrawW;
        } catch (e) {
          console.error('Error drawing logo on canvas:', e);
        }
      }

      // Titles
      const textX = LEFT_PAD + drawnLogoW + 40;
      ctx.textAlign    = 'left';
      ctx.textBaseline = 'top';

      ctx.fillStyle = TITLE_COLOR;
      ctx.font      = `bold 42px 'Inter', system-ui, sans-serif`;
      ctx.fillText(mainTitle.toUpperCase(), textX, HEADER_Y + 35);

      ctx.fillStyle = SUB_COLOR;
      ctx.font      = `700 20px 'Inter', system-ui, sans-serif`;
      ctx.fillText(subTitle.toUpperCase(), textX, HEADER_Y + 95);

      // ── D. Time-column background strip ─────────────────────────────
      ctx.fillStyle = TIME_COL_BG;
      ctx.fillRect(0, DAY_Y, LEFT_PAD, DAY_H + GRID_H);

      // ── E. Day-of-week labels zone ───────────────────────────────────
      ctx.fillStyle = DAY_BAR_BG;
      ctx.fillRect(LEFT_PAD, DAY_Y, gridW, DAY_H);

      // Bottom border on day bar
      ctx.strokeStyle = GRID_LINE;
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.moveTo(LEFT_PAD, DAY_Y + DAY_H);
      ctx.lineTo(LEFT_PAD + gridW, DAY_Y + DAY_H);
      ctx.stroke();

      const DAYS_LABELS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle    = DAY_TEXT;
      ctx.font         = `800 16px 'Inter', system-ui, sans-serif`;

      DAYS_LABELS.forEach((label, idx) => {
        const x = LEFT_PAD + idx * colW + colW / 2;
        const y = DAY_Y + DAY_H / 2;
        ctx.fillText(label, x, y);

        // Column separator
        if (idx > 0) {
          ctx.strokeStyle = GRID_LINE;
          ctx.lineWidth   = 1;
          ctx.beginPath();
          ctx.moveTo(LEFT_PAD + idx * colW, DAY_Y);
          ctx.lineTo(LEFT_PAD + idx * colW, DAY_Y + DAY_H);
          ctx.stroke();
        }
      });

      // ── F. Calendar grid background ──────────────────────────────────
      ctx.fillStyle = GRID_BG;
      ctx.fillRect(LEFT_PAD, GRID_Y, gridW, GRID_H);

      // Outer border
      ctx.strokeStyle = GRID_LINE;
      ctx.lineWidth   = 2;
      ctx.strokeRect(LEFT_PAD, GRID_Y, gridW, GRID_H);

      // Hour lines + labels
      for (let h = gridStartHour; h <= gridEndHour; h++) {
        const y = GRID_Y + (h - gridStartHour) * rowH;

        // Hour label (inside time column)
        if (h < gridEndHour) {
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle    = HOUR_TEXT;
          ctx.font         = `600 13px 'Inter', system-ui, sans-serif`;
          ctx.fillText(`${h.toString().padStart(2, '0')}:00`, LEFT_PAD / 2, y + 5);
        }

        // Horizontal line
        ctx.strokeStyle = (h === gridStartHour || h === gridEndHour) ? GRID_LINE : HOUR_LINE;
        ctx.lineWidth   = (h === gridStartHour || h === gridEndHour) ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(LEFT_PAD, y);
        ctx.lineTo(LEFT_PAD + gridW, y);
        ctx.stroke();

        // Half-hour dashed line
        if (h < gridEndHour) {
          const yHalf = y + rowH / 2;
          ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(112,96,171,0.08)';
          ctx.lineWidth   = 1;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(LEFT_PAD, yHalf);
          ctx.lineTo(LEFT_PAD + gridW, yHalf);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Vertical column separators
      for (let i = 1; i < 7; i++) {
        const x = LEFT_PAD + i * colW;
        ctx.strokeStyle = GRID_LINE;
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.moveTo(x, GRID_Y);
        ctx.lineTo(x, GRID_Y + GRID_H);
        ctx.stroke();
      }

      // ── G. Class cards ───────────────────────────────────────────────
      classes.forEach(c => {
        const dayIndex = c.day - 1;
        if (dayIndex < 0 || dayIndex > 6) return;

        const startDec = timeToDecimal(c.startTime);
        const endDec   = timeToDecimal(c.endTime);

        if (startDec >= gridStartHour && endDec <= gridEndHour) {
          const cardY      = GRID_Y + (startDec - gridStartHour) * rowH;
          const cardEndY   = GRID_Y + (endDec   - gridStartHour) * rowH;
          const cardHeight = cardEndY - cardY;
          const padX       = 6;
          const cardX      = LEFT_PAD + dayIndex * colW + padX;
          const cardW      = colW - padX * 2;
          const radius     = 8;

          // Card fill
          ctx.fillStyle = c.color;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(cardX, cardY + 2, cardW, cardHeight - 4, radius);
          else ctx.rect(cardX, cardY + 2, cardW, cardHeight - 4);
          ctx.fill();

          // Subtle inner shadow overlay on top
          const topGrad = ctx.createLinearGradient(0, cardY + 2, 0, cardY + 2 + Math.min(cardHeight * 0.5, 30));
          topGrad.addColorStop(0, 'rgba(255,255,255,0.18)');
          topGrad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = topGrad;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(cardX, cardY + 2, cardW, cardHeight - 4, radius);
          else ctx.rect(cardX, cardY + 2, cardW, cardHeight - 4);
          ctx.fill();

          // Left accent bar (darker shade)
          ctx.fillStyle = 'rgba(0,0,0,0.25)';
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(cardX, cardY + 2, 5, cardHeight - 4, [radius, 0, 0, radius]);
          else ctx.fillRect(cardX, cardY + 2, 5, cardHeight - 4);
          ctx.fill();

          // Clip text inside card
          ctx.save();
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(cardX, cardY + 2, cardW, cardHeight - 4, radius);
          else ctx.rect(cardX, cardY + 2, cardW, cardHeight - 4);
          ctx.clip();

          ctx.textAlign    = 'left';
          ctx.textBaseline = 'top';
          const tX = cardX + 14;

          ctx.fillStyle = c.textColor || '#ffffff';
          ctx.font = "bold 18px 'Inter', system-ui, -apple-system, sans-serif";
          ctx.fillText(c.title, tX, cardY + 10);

          ctx.font = "500 14px 'Inter', system-ui, -apple-system, sans-serif";
          ctx.fillStyle = c.textColor === '#ffffff' ? 'rgba(255,255,255,0.82)' : 'rgba(0,0,0,0.65)';
          ctx.fillText(`${c.startTime} – ${c.endTime} hs`, tX, cardY + 28);

          if (c.coach && cardHeight > 60) {
            ctx.font = "italic 13px 'Inter', system-ui, -apple-system, sans-serif";
            ctx.fillStyle = c.textColor === '#ffffff' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.55)';
            ctx.fillText(`Prof. ${c.coach}`, tX, cardY + 46);
          }

          ctx.restore();
        }
      });

      // ── H. Footer ────────────────────────────────────────────────────
      // Thin top rule
      ctx.strokeStyle = isDark ? '#2d2540' : '#e8e4f3';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(LEFT_PAD, FOOTER_Y - 16);
      ctx.lineTo(LEFT_PAD + gridW, FOOTER_Y - 16);
      ctx.stroke();

      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle    = FOOT_COLOR;
      ctx.font         = `600 13px 'Inter', system-ui, sans-serif`;
      ctx.fillText(footerText.toUpperCase(), W / 2, FOOTER_Y);

      // ── I. Download ──────────────────────────────────────────────────
      const imageUri    = canvas.toDataURL('image/jpeg', 0.96);
      const downloadLink = document.createElement('a');
      downloadLink.href     = imageUri;
      downloadLink.download = `cronograma_semanal_cadba_${theme}.jpg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };


    // Load logo with async callbacks
    logoImg.onload = () => {
      drawAll(logoImg);
    };
    logoImg.onerror = () => {
      console.warn('Failed to load logo image, rendering text-only header.');
      drawAll(null);
    };
    logoImg.src = `${window.location.origin}${logoSrc}`;
  };

  // 6. Grid hours arrays for preview rendering
  const hoursArray = [];
  for (let h = gridStartHour; h < gridEndHour; h++) {
    hoursArray.push(h);
  }
  const totalHours = gridEndHour - gridStartHour;

  return (
    <div className={styles.calendarContainer}>
      
      {/* Visual Canvas (Hidden but rendered in HD for downloads) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Header Panel */}
      <div className={styles.calendarHeader}>
        <div className={styles.headerLeft}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0 }}>Cronograma de Clases Semanal</h3>
            {isSaving ? (
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.75rem', 
                backgroundColor: '#f5f3ff', 
                color: '#7060ab', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontWeight: '600',
                border: '1px solid #ddd6fe'
              }}>
                <Loader2 size={12} className={styles.spin} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Guardando cambios...</span>
              </span>
            ) : (
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.75rem', 
                backgroundColor: '#ecfdf5', 
                color: '#10b981', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontWeight: '600',
                border: '1px solid #d1fae5'
              }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                Guardado en la Nube
              </span>
            )}
          </div>
          <p style={{ marginTop: '6px' }}>Cargá las clases y exportá una grilla de alta definición nítida para compartir o imprimir. <strong>Tus cambios se guardan automáticamente para todos los administradores.</strong></p>
        </div>
        <div className={styles.headerActions}>
          <button 
            onClick={() => exportToJpg('dark')}
            className={`${styles.exportBtn} ${styles.darkExportBtn}`}
          >
            <Download size={15} /> Exportar JPG (Tema Oscuro)
          </button>
          <button 
            onClick={() => exportToJpg('light')}
            className={`${styles.exportBtn} ${styles.lightExportBtn}`}
          >
            <Download size={15} /> Exportar JPG (Tema Claro)
          </button>
        </div>
      </div>

      {/* Split Layout: Sidebar & Visual Grid */}
      <div className={styles.mainLayout}>
        
        {/* Sidebar Controls */}
        <aside className={styles.sidebar}>
          
          {/* Grid Scale Configuration Card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Sliders size={16} /> Configurar Escala Horaria
            </div>
            
            <div className={styles.settingsForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Hora Inicio Grilla</label>
                  <select 
                    className={styles.select}
                    value={gridStartHour}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setGridStartHour(val);
                      saveSchedule(classes, mainTitle, subTitle, footerText, val, gridEndHour);
                    }}
                  >
                    {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(h => (
                      <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Hora Fin Grilla</label>
                  <select 
                    className={styles.select}
                    value={gridEndHour}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setGridEndHour(val);
                      saveSchedule(classes, mainTitle, subTitle, footerText, gridStartHour, val);
                    }}
                  >
                    {[16,17,18,19,20,21,22,23,24].map(h => (
                      <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
                    ))}
                  </select>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '4px', marginTop: '6px', lineHeight: '1.3' }}>
                <Info size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>Esto ajusta el rango de horas que se visualizan en la grilla y en el JPG exportado.</span>
              </p>
            </div>
          </div>

          {/* Calendar Header & Footer Title Card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Edit2 size={16} /> Configurar Encabezado y Pie
            </div>
            <div className={styles.formGroup} style={{ marginBottom: '12px' }}>
              <label className={styles.label}>Título de la Institución</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="ej. CLUB DE ARQUEROS DE BUENOS AIRES"
                value={mainTitle}
                onChange={(e) => setMainTitle(e.target.value)}
                onBlur={() => saveSchedule(classes, mainTitle, subTitle, footerText)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.target.blur();
                  }
                }}
              />
            </div>
            <div className={styles.formGroup} style={{ marginBottom: '12px' }}>
              <label className={styles.label}>Subtítulo del Cronograma</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="ej. CRONOGRAMA DE CLASES Y HORARIOS SEMANALES"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                onBlur={() => saveSchedule(classes, mainTitle, subTitle, footerText)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.target.blur();
                  }
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Texto de Pie de Página</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="ej. Av. Vélez Sarsfield 268, Barracas, CABA"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                onBlur={() => saveSchedule(classes, mainTitle, subTitle, footerText)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.target.blur();
                  }
                }}
              />
              <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '6px' }}>
                Presioná Enter o hacé clic afuera para guardar los cambios de textos.
              </p>
            </div>
          </div>

          {/* Create / Edit Form Card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Plus size={16} /> 
              {isDuplicating ? 'Duplicar Clase' : editingId ? 'Editar Clase' : 'Agregar Nueva Clase'}
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              
              {/* Form errors */}
              {errorMsg && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', gap: '4px', alignItems: 'center', backgroundColor: '#fef2f2', padding: '8px 12px', borderRadius: '6px', border: '1px solid #fee2e2' }}>
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Nombre de Clase</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="ej. Iniciación, Escuela, Práctica..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Day Selection */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Día de la semana</label>
                <select 
                  className={styles.select}
                  value={formData.day}
                  onChange={(e) => setFormData(prev => ({ ...prev, day: parseInt(e.target.value) }))}
                >
                  {DAYS_OF_WEEK.map(d => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Times Row */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Desde</label>
                  <input 
                    type="time" 
                    className={styles.input}
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Hasta</label>
                  <input 
                    type="time" 
                    className={styles.input}
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              {/* Coach / Instructor */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Profesor (Opcional)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="ej. Prof. Marcelo"
                  value={formData.coach}
                  onChange={(e) => setFormData(prev => ({ ...prev, coach: e.target.value }))}
                />
              </div>

              {/* Accent Color */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Color de Tarjeta</label>
                <div className={styles.colorPicker}>
                  {PRESET_COLORS.map(color => (
                    <div 
                      key={color.name}
                      onClick={() => handleColorSelect(color)}
                      className={`${styles.colorOption} ${formData.color === color.bg ? styles.colorSelected : ''}`}
                      style={{ backgroundColor: color.bg }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.btnGroup}>
                <button type="submit" className={styles.submitBtn}>
                  {isDuplicating ? 'Duplicar Clase' : editingId ? 'Actualizar' : 'Añadir a Grilla'}
                </button>
                {(editingId || isDuplicating || formData.title) && (
                  <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                    Cancelar
                  </button>
                )}
              </div>

            </form>
          </div>

        </aside>

        {/* Visual Timeline Grid Preview */}
        <main className={styles.gridCard}>
          {classes.length === 0 ? (
            <div className={styles.emptyState}>
              <Calendar size={48} className={styles.emptyIcon} />
              <h4>Grilla Vacía</h4>
              <p>Comenzá a cargar clases desde el formulario de la izquierda para armar el cronograma semanal.</p>
            </div>
          ) : (
            <>
              {/* Official Preview Header */}
              <div className={styles.previewHeader}>
                <img 
                  src="/images/logo.png" 
                  alt="CAdBA Logo" 
                  className={styles.previewLogo} 
                />
                <div className={styles.previewTitles}>
                  {isEditingMainTitle ? (
                    <input
                      type="text"
                      className={styles.inlineInputClubTitle}
                      value={mainTitle}
                      onChange={(e) => setMainTitle(e.target.value)}
                      onBlur={() => {
                        setIsEditingMainTitle(false);
                        saveSchedule(classes, mainTitle, subTitle, footerText);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.target.blur();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <h2 
                      className={styles.previewClubTitle}
                      onClick={() => setIsEditingMainTitle(true)}
                      title="Clic para editar título institucional"
                    >
                      {mainTitle}
                      <Edit2 size={12} className={styles.inlineEditIcon} style={{ marginLeft: '8px' }} />
                    </h2>
                  )}

                  {isEditingSubTitle ? (
                    <input
                      type="text"
                      className={styles.inlineInputCalendarTitle}
                      value={subTitle}
                      onChange={(e) => setSubTitle(e.target.value)}
                      onBlur={() => {
                        setIsEditingSubTitle(false);
                        saveSchedule(classes, mainTitle, subTitle, footerText);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.target.blur();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <h3 
                      className={styles.previewCalendarTitle}
                      onClick={() => setIsEditingSubTitle(true)}
                      title="Clic para editar subtítulo del cronograma"
                    >
                      {subTitle}
                      <Edit2 size={10} className={styles.inlineEditIcon} style={{ marginLeft: '8px' }} />
                    </h3>
                  )}
                </div>
              </div>

              <div className={styles.calendarTimeline}>
                
                {/* Header: Lunes to Domingo */}
                <div className={styles.gridHeader}>
                  <div className={styles.timeHeaderCell}>Hora</div>
                  {DAYS_OF_WEEK.map(d => (
                    <div key={d.id} className={styles.dayHeaderCell}>
                      <span className={styles.dayName}>{d.label}</span>
                    </div>
                  ))}
                </div>

                {/* Grid Body */}
                <div 
                  className={styles.gridBody}
                  style={{ height: `${totalHours * 30}px` }} // 0.5px = 1 min height scale (compact layout)
                >
                  
                  {/* Time Slots Labels Column */}
                  <div className={styles.timeColumn}>
                    {hoursArray.map((hour, idx) => (
                      <div 
                        key={hour} 
                        className={styles.timeSlotLabel}
                        style={{ 
                          position: 'absolute',
                          top: `${idx * 30}px`,
                          height: '30px',
                          width: '40px'
                        }}
                      >
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                    ))}
                  </div>

                  {/* Day Columns */}
                  {DAYS_OF_WEEK.map(d => {
                    const dayClasses = classes.filter(c => c.day === d.id);
                    
                    return (
                      <div key={d.id} className={styles.dayColumn}>
                        
                        {/* Grid Line Marks for Hours */}
                        {hoursArray.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={styles.hourLine} 
                            style={{ top: `${idx * 30}px` }} 
                          />
                        ))}
                        {hoursArray.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={styles.hourLineHalf} 
                            style={{ top: `${idx * 30 + 15}px` }} 
                          />
                        ))}

                        {/* Class Cards rendering absolute positioned */}
                        {dayClasses.map(c => {
                          const startDec = timeToDecimal(c.startTime);
                          const endDec = timeToDecimal(c.endTime);

                          // Only render if it fits inside current configured range bounds
                          if (startDec >= gridStartHour && endDec <= gridEndHour) {
                            const topPx = (startDec - gridStartHour) * 30;
                            const heightPx = (endDec - startDec) * 30;

                            return (
                              <div 
                                key={c.id}
                                className={styles.classCard}
                                style={{ 
                                  top: `${topPx + 2}px`, 
                                  height: `${heightPx - 4}px`,
                                  backgroundColor: c.color,
                                  color: c.textColor || '#ffffff',
                                  borderLeftColor: 'rgba(0, 0, 0, 0.25)'
                                }}
                                onClick={() => handleEdit(c)}
                              >
                                <div className={styles.classCardHeader}>
                                  <div className={styles.classTitle}>{c.title}</div>
                                  <div className={styles.classTime}>
                                    <Clock size={10} />
                                    <span>{c.startTime} - {c.endTime}</span>
                                  </div>
                                </div>

                                {c.coach && heightPx >= 45 && (
                                  <div className={styles.classCoach}>
                                    <User size={10} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
                                    <span>{c.coach}</span>
                                  </div>
                                )}

                                {/* Hover Edit/Delete Action Badges */}
                                <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                                  <button 
                                    className={styles.cardActionBtn} 
                                    title="Editar clase"
                                    onClick={() => handleEdit(c)}
                                  >
                                    <Edit2 size={10} />
                                  </button>
                                  <button 
                                    className={styles.cardActionBtn} 
                                    title="Duplicar clase"
                                    onClick={() => handleDuplicate(c)}
                                  >
                                    <Copy size={10} />
                                  </button>
                                  <button 
                                    className={`${styles.cardActionBtn} ${styles.deleteBtn}`} 
                                    title="Eliminar clase"
                                    onClick={() => handleDelete(c.id)}
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>

                              </div>
                            );
                          }
                          return null;
                        })}

                      </div>
                    );
                  })}

                </div>

              </div>

              {/* Official Preview Footer */}
              {isEditingFooter ? (
                <div className={styles.previewFooterEditing}>
                  <input
                    type="text"
                    className={styles.inlineInputFooter}
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    onBlur={() => {
                      setIsEditingFooter(false);
                      saveSchedule(classes, mainTitle, subTitle, footerText);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.target.blur();
                      }
                    }}
                    autoFocus
                  />
                </div>
              ) : (
                <div 
                  className={styles.previewFooter}
                  onClick={() => setIsEditingFooter(true)}
                  title="Clic para editar pie de página"
                >
                  {footerText}
                  <Edit2 size={10} className={styles.inlineEditIcon} style={{ marginLeft: '6px' }} />
                </div>
              )}
            </>
          )}
        </main>

      </div>
    </div>
  );
}
