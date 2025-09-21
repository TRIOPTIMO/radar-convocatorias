import { PROXY_URL } from "../constants/constants";
import type { FeedItem } from "../types/types";

export function applyProxy(url: string, useProxy: boolean) {
  if (!useProxy) return url;

  // En desarrollo (Vite) usa los proxies locales
  if (typeof window !== "undefined" && location.origin.includes("http://localhost")) {
    if (url.startsWith("https://ted.europa.eu/")) {
      const u = new URL(url);
      return "/ted" + u.pathname + (u.search || "");
    }
    if (url.startsWith("https://ec.europa.eu/")) {
      const u = new URL(url);
      return "/ft" + u.pathname + (u.search || "");
    }
  }

  // En producción, si configuras un proxy serverless tipo ?url=
  if (PROXY_URL) {
    return PROXY_URL + encodeURIComponent(url);
  }

  // Último recurso (puede fallar por CORS)
  return url;
}

export async function fetchAsText(url: string): Promise<string> {
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
return await res.text();
}

function extractField(html: string, field: string): string | undefined {
  const regex = new RegExp(`<b>${field}<\\/b>:\\s*([^<]+)`, "i");
  const match = html.match(regex);
  if (match) return match[1].trim();
  return undefined;
}

export function parseRSS(xmlText: string, sourceId: string, sourceName: string): FeedItem[] {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");

  const isAtom = xml.getElementsByTagName("feed").length > 0 && xml.getElementsByTagName("entry").length > 0;
  const items: FeedItem[] = [];

  if (isAtom) {
    const entries = Array.from(xml.getElementsByTagName("entry"));
    for (const e of entries) {
      const title = e.getElementsByTagName("title")[0]?.textContent || "(sin título)";
      const link = e.getElementsByTagName("link")[0]?.getAttribute("href") || "";
      const summary = e.getElementsByTagName("summary")[0]?.textContent
        || e.getElementsByTagName("content")[0]?.textContent
        || "";
      const pubDate = e.getElementsByTagName("updated")[0]?.textContent
        || e.getElementsByTagName("published")[0]?.textContent
        || undefined;
      const id = hashId(sourceId + link + title);

      const deadline = extractField(summary, "Deadline");       // 👈
      const openingDate = extractField(summary, "Opening Date"); // 👈

      items.push({
        id, sourceId, sourceName, title, link,
        description: summary, pubDate, score: 0, matched: [],
        deadline, openingDate
      });
    }
  } else {
    const rssItems = Array.from(xml.getElementsByTagName("item"));
    for (const it of rssItems) {
      const title = it.getElementsByTagName("title")[0]?.textContent || "(sin título)";
      const link = it.getElementsByTagName("link")[0]?.textContent || "";
      const description = it.getElementsByTagName("description")[0]?.textContent || "";
      const pubDate = it.getElementsByTagName("pubDate")[0]?.textContent || undefined;
      const id = hashId(sourceId + link + title);

      const deadline = extractField(description, "Deadline");       // 👈
      const openingDate = extractField(description, "Opening Date"); // 👈

      items.push({
        id, sourceId, sourceName, title, link,
        description, pubDate, score: 0, matched: [],
        deadline, openingDate
      });
    }
  }

  return items;
}




function hashId(s: string) {
let h = 0;
for (let i = 0; i < s.length; i++) {
h = (h << 5) - h + s.charCodeAt(i);
h |= 0;
}
return String(h);
}