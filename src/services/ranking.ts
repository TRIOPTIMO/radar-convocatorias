export function sanitizeHTML(html?: string) {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function escapeForRegex(s: string) {
  // Escapa cualquier carácter especial de regex
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function rankItem(text: string, keywords: string[]): { score: number; matched: string[] } {
  const hay = text.toLowerCase();
  const matched: string[] = [];
  let score = 0;

  for (const kw of keywords) {
    const k = kw.toLowerCase().trim();
    if (!k) continue;

    const escaped = escapeForRegex(k);
    // límites por no-palabra (Unicode): inicio/fin o carácter que no sea letra/dígito/_
    // usar 'iu' (insensible + unicode)
    const re = new RegExp(`(^|\\W)${escaped}($|\\W)`, "iu");
    if (re.test(hay)) {
      matched.push(kw);
      score += 1;
    }
  }

  if (/call|grant|convocatoria|subvenci/iu.test(hay)) score += 1;
  if (/ngo|ong|non[- ]?profit|civil society/iu.test(hay)) score += 1;

  return { score, matched };
}
