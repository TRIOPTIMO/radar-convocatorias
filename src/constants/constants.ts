import type { FeedSource } from "../types/types";


export const APP_STORAGE_KEY = "trioptimo-radar-config-v1";
export const KNOWN_IDS_KEY = "trioptimo-known-ids";


export const DEFAULT_KEYWORDS = [
"ONG", "nonprofit", "asociación", "inclusión", "juventud",
"migración", "educación", "cooperación", "igualdad", "salud",
"medio ambiente", "clima", "digitalización", "transformación digital",
];


// PON AQUÍ TU PROXY (ej.: "https://tu-proxy.example.com/")
export const PROXY_URL = ""; // Ej.: "https://cors.isomorphic-git.org/" (solo pruebas)


function cryptoRandomId() {
if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
return Math.random().toString(36).slice(2);
}


export const DEFAULT_FEEDS: FeedSource[] = [
{
id: cryptoRandomId(),
name: "EU Funding & Tenders – All calls (ejemplo)",
url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-rss",
tags: ["UE", "calls"],
enabled: true,
},
{
id: cryptoRandomId(),
name: "TED – España (ejemplo)",
url: "https://ted.europa.eu/udl?uri=TED:NOTICE:RSS:ES:XML",
tags: ["UE", "licitaciones"],
enabled: false,
},
];