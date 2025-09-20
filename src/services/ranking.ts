export function sanitizeHTML(html?: string) {
if (!html) return "";
const tmp = document.createElement("div");
tmp.innerHTML = html;
return tmp.textContent || tmp.innerText || "";
}


export function rankItem(text: string, keywords: string[]): { score: number; matched: string[] } {
const hay = text.toLowerCase();
const matched: string[] = [];
let score = 0;
for (const kw of keywords) {
const k = kw.toLowerCase().trim();
if (!k) continue;
const re = new RegExp(`(^|\W)${k.replace(/[-/\^$*+?.()|[\]{}]/g, "\$&")}($|\W)`, "i");
if (re.test(hay)) {
matched.push(kw);
score += 1;
}
}
if (/call|grant|convocatoria|subvenci/gi.test(hay)) score += 1;
if (/ngo|ong|non[- ]?profit|civil society/gi.test(hay)) score += 1;
return { score, matched };
}