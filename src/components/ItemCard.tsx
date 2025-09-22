import { Paper, Box, Typography, Chip, Link } from "@mui/material";
import type { FeedItem } from "../types/types";
import { sanitizeHTML } from "../services/ranking"; // 👈 importa
import { isExpired, parseDeadlineToDate } from "../services/dates";

export default function ItemCard({ it }: { it: FeedItem }) {
    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Box display="flex" gap={2}>
                <Box textAlign="center" minWidth={56}>
                    <Typography variant="caption" color="text.secondary">Score</Typography>
                    <Typography variant="h6" fontWeight={800}>{it.score}</Typography>
                </Box>
                <Box flex={1} minWidth={0}>
                    <Typography variant="h6" component={Link} href={it.link} target="_blank" underline="hover">
                        {it.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        {it.sourceName} {it.pubDate ? `· ${new Date(it.pubDate).toLocaleString()}` : ""}
                    </Typography>

                    {it.matched.length > 0 && (
                        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                            {it.matched.map((m, i) => (
                                <Chip key={i} size="small" label={m} color="secondary" variant="outlined" />
                            ))}
                        </Box>
                    )}

                    {it.description && (
                        <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                            {sanitizeHTML(it.description)} {/* 👈 sin etiquetas */}
                        </Typography>
                    )}
                    <Box mt={1} display="flex" gap={2} flexWrap="wrap">
                        {it.openingDate && (
                            <Typography variant="body2" color="primary">
                                📅 Opening: <strong>{it.openingDate}</strong>
                            </Typography>
                        )}
                        {it.deadline && (
                            <Typography
                                variant="body2"
                                color={isExpired(it.deadline) ? "text.secondary" : "error"}
                                fontWeight={isExpired(it.deadline) ? 400 : 600}
                            >
                                ⏰ Deadline:{" "}
                                <strong>
                                    {parseDeadlineToDate(it.deadline)?.toLocaleString("es-ES", {
                                        dateStyle: "full",
                                        timeStyle: "short",
                                    }) ?? it.deadline}
                                </strong>
                                {isExpired(it.deadline) && " · Expirada"}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}
