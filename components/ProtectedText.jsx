"use client";

import { useState, useEffect } from 'react';
import { deobfuscateText } from '@/utils/obfuscate';

export default function ProtectedText({ encoded, className }) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!encoded) return;
    // Block automated headless browsers (Puppeteer / Selenium / Playwright)
    if (typeof navigator !== 'undefined' && navigator.webdriver) return;

    const reveal = () => {
      setText(deobfuscateText(encoded));
    };

    // Decode on first real human interaction (scroll, mouse move, touch, or key press)
    const events = ['pointermove', 'touchstart', 'scroll', 'keydown', 'click'];
    events.forEach((evt) => window.addEventListener(evt, reveal, { once: true, passive: true }));

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, reveal));
    };
  }, [encoded]);

  if (!text) {
    return <span className={className} aria-hidden="true">•••</span>;
  }

  return <span className={className}>{text}</span>;
}
