import { PROXY_URL } from "../constants/constants";
import type { FeedItem } from "../types/types";


export function applyProxy(url: string, useProxy: boolean) {
if (!useProxy) return url;
if (!PROXY_URL) return url; // si no definiste proxy, intenta directo
return PROXY_URL + url;
}


export async function fetchAsText(url: string): Promise<string> {
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
return await res.text();
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
const summary = e.getElementsByTagName("summary")[0]?.textContent || e.getElementsByTagName("content")[0]?.textContent || "";
const pubDate = e.getElementsByTagName("updated")[0]?.textContent || e.getElementsByTagName("published")[0]?.textContent || undefined;
const id = hashId(sourceId + link + title);
items.push({ id, sourceId, sourceName, title, link, description: summary, pubDate, score: 0, matched: [] });
}
} else {
const rssItems = Array.from(xml.getElementsByTagName("item"));
for (const it of rssItems) {
const title = it.getElementsByTagName("title")[0]?.textContent || "(sin título)";
const link = it.getElementsByTagName("link")[0]?.textContent || "";
const description = it.getElementsByTagName("description")[0]?.textContent || "";
const pubDate = it.getElementsByTagName("pubDate")[0]?.textContent || undefined;
const id = hashId(sourceId + link + title);
items.push({ id, sourceId, sourceName, title, link, description, pubDate, score: 0, matched: [] });
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