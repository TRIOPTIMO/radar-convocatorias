import { APP_STORAGE_KEY, DEFAULT_FEEDS, DEFAULT_KEYWORDS, KNOWN_IDS_KEY } from "../constants/constants";
import type { AppConfig } from "../types/types";


export function saveConfig(cfg: AppConfig) {
localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(cfg));
}


export function loadConfig(): AppConfig {
const raw = localStorage.getItem(APP_STORAGE_KEY);
if (raw) {
try {
const parsed = JSON.parse(raw);
return {
feeds: parsed.feeds ?? DEFAULT_FEEDS,
keywords: parsed.keywords ?? DEFAULT_KEYWORDS,
minScore: parsed.minScore ?? 2,
autoRefreshMinutes: parsed.autoRefreshMinutes ?? 60,
useProxy: parsed.useProxy ?? false,
hideExpired: parsed.hideExpired ?? true,
} as AppConfig;
} catch {}
}
return {
feeds: DEFAULT_FEEDS,
keywords: DEFAULT_KEYWORDS,
minScore: 2,
autoRefreshMinutes: 60,
useProxy: false,
hideExpired: true,
};
}


export function loadKnownIds(): Set<string> {
try {
const arr = JSON.parse(localStorage.getItem(KNOWN_IDS_KEY) || "[]");
return new Set<string>(arr);
} catch {
return new Set();
}
}


export function saveKnownIds(set: Set<string>) {
localStorage.setItem(KNOWN_IDS_KEY, JSON.stringify(Array.from(set)));
}