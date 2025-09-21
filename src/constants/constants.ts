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


export const DEFAULT_FEEDS: FeedSource[]  = [
  {
    id: cryptoRandomId(),
    name: "EU Funding & Tenders – Global RSS",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities/data/referenceData/grantTenders-rss.xml",
    tags: ["UE","F&T"],
    enabled: true,
  },
  {
    id: cryptoRandomId(),
    name: "TED – búsqueda 'educ'",
    url: "https://ted.europa.eu/en/simap/rss-feed/-/rss/search/educ",
    tags: ["TED","licitaciones"],
    enabled: true,
  },
];

