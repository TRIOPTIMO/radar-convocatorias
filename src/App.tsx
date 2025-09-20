import React from "react";
import { AppBar, Toolbar, Typography, Button, Container, Stack, Box } from "@mui/material";
import ConfigPanel from "./components/ConfigPanel";
import FeedList from "./components/FeedList";
import { useRadar } from "./hooks/useRadar";

export default function App() {
  const {
    config, setConfig,
    loading, error, lastFetch,
    query, setQuery, onlyNew, setOnlyNew,
    filteredItems,
    refresh, markAllAsSeen,
  } = useRadar();

  function addFeed() {
    const url = window.prompt("URL del feed RSS/Atom");
    if (!url) return;
    const name = window.prompt("Nombre para el feed") || url;
    setConfig({ ...config, feeds: [...config.feeds, { id: cryptoRandomId(), name, url, tags: [], enabled: true }] });
  }

  function removeFeed(id: string) {
    setConfig({ ...config, feeds: config.feeds.filter((f) => f.id !== id) });
  }

  function toggleFeed(id: string) {
    setConfig({ ...config, feeds: config.feeds.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)) });
  }

  function updateKeywords(s: string) {
    const arr = s.split(",").map((x) => x.trim()).filter(Boolean);
    setConfig({ ...config, keywords: arr });
  }

  return (
    <>
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Trióptimo · Radar de Convocatorias
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button onClick={refresh} variant="contained" color="secondary" disabled={loading}>
              {loading ? "Actualizando…" : "Actualizar ahora"}
            </Button>
            <Button onClick={markAllAsSeen} variant="outlined" color="inherit">
              Marcar todo como visto
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Layout responsive con Stack */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Box
            sx={{
              flexBasis: { xs: "100%", md: "33.333%" },
              flexGrow: 0,
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            <ConfigPanel
              config={config}
              onChange={setConfig}
              onAddFeed={addFeed}
              onRemoveFeed={removeFeed}
              onToggleFeed={toggleFeed}
              onUpdateKeywords={updateKeywords}
            />
          </Box>

          <Box
            sx={{
              flexBasis: { xs: "100%", md: "66.666%" },
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <FeedList
              items={filteredItems}
              query={query}
              setQuery={setQuery}
              onlyNew={onlyNew}
              setOnlyNew={setOnlyNew}
              lastFetch={lastFetch}
              error={error}
              loading={loading}
            />
          </Box>
        </Stack>
      </Container>
    </>
  );
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}
