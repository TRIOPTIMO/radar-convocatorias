// src/hooks/useRadar.ts
import { useEffect, useMemo, useRef, useState } from "react";
import type { AppConfig, FeedItem } from "../types/types";
import { applyProxy, fetchAsText, parseRSS } from "../services/rss";
import { rankItem, sanitizeHTML } from "../services/ranking";
import { loadConfig, loadKnownIds, saveConfig, saveKnownIds } from "../services/storage";

export function useRadar() {
  // ---- Estado principal
  const [config, setConfig] = useState<AppConfig>(() => loadConfig());
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  // ---- Filtros UI
  const [query, setQuery] = useState("");
  const [onlyNew, setOnlyNew] = useState(true);

  // ---- Cache de vistos
  const knownIdsRef = useRef<Set<string>>(loadKnownIds());

  // ---- Persistir config
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  // ---- Auto-refresh por intervalo
  useEffect(() => {
    const minutes = Math.max(1, Number(config.autoRefreshMinutes) || 60);
    const id = setInterval(() => {
      refresh().catch(console.error);
    }, minutes * 60 * 1000);
    return () => clearInterval(id);
  }, [
    config.autoRefreshMinutes,
    // Dependencias que cambian la consulta
    config.feeds,
    config.keywords,
    config.minScore,
    config.useProxy,
  ]);

  // ---- Permiso de notificaciones (solo en cliente)
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => void 0);
      }
    }
  }, []);

  // ---- Refresh inicial al montar
  useEffect(() => {
    refresh().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Filtro y orden
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = items;

    if (q) {
      arr = arr.filter((it) =>
        (it.title + " " + (it.description || "")).toLowerCase().includes(q)
      );
    }
    if (onlyNew) {
      arr = arr.filter((it) => !knownIdsRef.current.has(it.id));
    }
    // orden por score desc
    return arr.slice().sort((a, b) => b.score - a.score);
  }, [items, query, onlyNew]);

  // ---- Lógica principal: descargar y rankear
  async function refresh() {
    setLoading(true);
    setError(null);

    try {
      const enabledFeeds = config.feeds.filter((f) => f.enabled);
      const all: FeedItem[] = [];

      for (const f of enabledFeeds) {
        try {
          const url = applyProxy(f.url, config.useProxy);
          const xml = await fetchAsText(url);
          const parsed = parseRSS(xml, f.id, f.name);

          for (const it of parsed) {
            const baseText = `${it.title}\n${sanitizeHTML(it.description)}`;
            const { score, matched } = rankItem(baseText, config.keywords);
            it.score = score;
            it.matched = matched;
            all.push(it);
          }
        } catch (e: unknown) {
          // No paramos todo por el fallo de un feed
          if (import.meta?.env?.DEV) {
            console.warn("Error en feed:", f.name, e);
          }
        }
      }

      // Deduplicar por id (link+title hash) y filtrar por score
      const map = new Map<string, FeedItem>();
      for (const it of all) map.set(it.id, it);

      const min = Number.isFinite(config.minScore) ? config.minScore : 0;
      const list = Array.from(map.values()).filter((x) => x.score >= (min || 0));

      // Notificaciones de nuevos relevantes
      const newOnes = list.filter((x) => !knownIdsRef.current.has(x.id));
      if (
        newOnes.length > 0 &&
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        const n = Math.min(newOnes.length, 5);
        const sample = newOnes.slice(0, n);
        new Notification(`Nuevas convocatorias relevantes: ${newOnes.length}`, {
          body: sample.map((s) => `• ${s.title}`).join("\n"),
        });
      }

      setItems(list);
      setLastFetch(new Date());
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  // ---- Marcar como vistos
  function markAllAsSeen() {
    const ids = new Set(knownIdsRef.current);
    for (const it of items) ids.add(it.id);
    knownIdsRef.current = ids;
    saveKnownIds(ids);
  }

  return {
    // estado
    config,
    setConfig,
    loading,
    error,
    lastFetch,

    // filtros
    query,
    setQuery,
    onlyNew,
    setOnlyNew,

    // datos
    filteredItems,

    // acciones
    refresh,
    markAllAsSeen,
  };
}
