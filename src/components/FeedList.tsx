import React from "react";
import { Paper, TextField, FormControlLabel, Checkbox, Typography, Divider, Alert, CircularProgress, Stack } from "@mui/material";
import ItemCard from "./ItemCard";
import type { FeedItem } from "../types/types";


interface Props {
items: FeedItem[];
query: string;
setQuery: (s: string) => void;
onlyNew: boolean;
setOnlyNew: (v: boolean) => void;
lastFetch: Date | null;
error: string | null;
loading: boolean;
}


export default function FeedList({ items, query, setQuery, onlyNew, setOnlyNew, lastFetch, error, loading }: Props) {
return (
<Paper elevation={1} sx={{ p: 2 }}>
<Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} justifyContent="space-between">
<Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
<TextField
placeholder="Buscar en resultados…"
value={query}
onChange={(e) => setQuery(e.target.value)}
fullWidth
/>
<FormControlLabel control={<Checkbox checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} />} label="Solo nuevos" />
</Stack>
<Typography variant="caption" color="text.secondary">
{lastFetch ? `Última actualización: ${lastFetch.toLocaleString()}` : "Sin actualizar aún"}
</Typography>
</Stack>


{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
{loading && (
<Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
<CircularProgress size={20} />
<Typography variant="body2">Actualizando…</Typography>
</Stack>
)}


<Divider sx={{ my: 2 }} />


{items.length === 0 && !loading ? (
<Typography variant="body2" color="text.secondary" align="center" sx={{ py: 6 }}>
No hay resultados (ajusta palabras clave o umbral, o pulsa "Actualizar").
</Typography>
) : (
<Stack spacing={2}>
{items.map((it) => (
<ItemCard key={it.id} it={it} />
))}
</Stack>
)}
</Paper>
);
}