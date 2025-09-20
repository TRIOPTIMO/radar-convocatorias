import React from "react";
import {
  Paper, Typography, TextField, FormControlLabel, Switch,
  Divider, Button, List, ListItem, ListItemIcon, Checkbox, ListItemText, IconButton, Stack
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import type { AppConfig } from "../types/types";

interface Props {
  config: AppConfig;
  onChange: (cfg: AppConfig) => void;
  onAddFeed: () => void;
  onRemoveFeed: (id: string) => void;
  onToggleFeed: (id: string) => void;
  onUpdateKeywords: (s: string) => void;
}

export default function ConfigPanel({
  config, onChange, onAddFeed, onRemoveFeed, onToggleFeed, onUpdateKeywords
}: Props) {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Configuración</Typography>

      <TextField
        label="Palabras clave (separadas por coma)"
        value={config.keywords.join(", ")}
        onChange={(e) => onUpdateKeywords(e.target.value)}
        multiline minRows={3} fullWidth sx={{ mb: 2 }}
      />

      {/* Reemplazamos Grid por Stack */}
      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <TextField
          label="Umbral relevancia"
          type="number"
          value={config.minScore}
          onChange={(e) => onChange({ ...config, minScore: Number(e.target.value) })}
          fullWidth
        />
        <TextField
          label="Refresco (min)"
          type="number"
          value={config.autoRefreshMinutes}
          onChange={(e) => onChange({ ...config, autoRefreshMinutes: Number(e.target.value) })}
          fullWidth
        />
      </Stack>

      <FormControlLabel
        control={
          <Switch
            checked={config.useProxy}
            onChange={(e) => onChange({ ...config, useProxy: e.target.checked })}
          />
        }
        label="Usar proxy CORS"
      />

      <Divider sx={{ my: 2 }} />

      {/* Header Feeds */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle1">Feeds</Typography>
        <Button onClick={onAddFeed} size="small">Añadir feed</Button>
      </Stack>

      <List dense>
        {config.feeds.map((f) => (
          <ListItem
            key={f.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => onRemoveFeed(f.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={f.enabled}
                onChange={() => onToggleFeed(f.id)}
              />
            </ListItemIcon>
            <ListItemText
              primary={f.name}
              secondary={
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ wordBreak: "break-all" }}
                >
                  {f.url}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
