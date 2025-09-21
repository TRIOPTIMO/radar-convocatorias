export interface FeedSource {
id: string;
name: string;
url: string;
tags: string[];
enabled: boolean;
}


export interface AppConfig {
feeds: FeedSource[];
keywords: string[];
minScore: number; // umbral de relevancia para notificar/mostrar
autoRefreshMinutes: number; // intervalo de actualización
useProxy: boolean;
}


export interface FeedItem {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  link: string;
  description: string;
  pubDate?: string;
  score: number;
  matched: string[];
  deadline?: string;
  openingDate?: string; 
}
