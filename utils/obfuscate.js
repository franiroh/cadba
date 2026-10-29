const XOR_KEY = 42;

/**
 * Obfuscates a string on the server so phone numbers and emails
 * never appear in plain text or plain base64 in the HTML / RSC payload.
 */
export function obfuscateText(str) {
  if (!str) return '';
  const text = String(str);
  const bytes = Array.from(text).map((ch, idx) => ch.charCodeAt(0) ^ ((XOR_KEY + idx) % 127));
  return Buffer.from(Uint8Array.from(bytes)).toString('base64');
}

/**
 * Decodes an obfuscated string on the client.
 */
export function deobfuscateText(encoded) {
  if (!encoded) return '';
  try {
    const binary = atob(encoded);
    let out = '';
    for (let i = 0; i < binary.length; i++) {
      out += String.fromCharCode(binary.charCodeAt(i) ^ ((XOR_KEY + i) % 127));
    }
    return out;
  } catch {
    return '';
  }
}
