"use client";

import { useState, useEffect } from 'react';
import { deobfuscateText } from '@/utils/obfuscate';

export default function ProtectedText({ encoded, className }) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (encoded) {
      setText(deobfuscateText(encoded));
    }
  }, [encoded]);

  if (!text) {
    return <span className={className} aria-hidden="true">•••</span>;
  }

  return <span className={className}>{text}</span>;
}
