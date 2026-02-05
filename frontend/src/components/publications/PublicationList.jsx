import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import {
  getAllPublications,
  getPublicationById,
  changePublicationStatus,
} from "../../api/publicationApi";
import { getAllAuthors } from "../../api/authorApi";

const editorialStatuses = [
  "DRAFT",
  "IN_REVIEW",
  "APPROVED",
  "PUBLISHED",
  "REJECTED",
];

const PublicationList = ({ refresh }) => {
  const [publications, setPublications] = useState([]);
  const [authorsMap, setAuthorsMap] = useState({});
  const [selectedPublication, setSelectedPublication] = useState(null);

  const [contentOpen, setContentOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const [newStatus, setNewStatus] = useState("");
  const [searchId, setSearchId] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Autores
  useEffect(() => {
    getAllAuthors().then((res) => {
      const map = {};
      res.data.forEach((a) => {
        map[a.id] = `${a.nombre} ${a.apellido}`;
      });
      setAuthorsMap(map);
    });
  }, []);

  // Publicaciones
  const loadPublications = () => {
    getAllPublications()
      .then((res) => {
        setPublications(res.data || []);
        setError("");
      })
      .catch(() => setError("No se pudo conectar con el servicio de publicaciones"));
  };

  useEffect(() => {
    loadPublications();
  }, [refresh]);

  // Ver contenido
  const openContent = (p) => {
    setSelectedPublication(p);
    setContentOpen(true);
  };

  // Buscar por ID
  const searchById = async () => {
    if (!searchId.trim()) return;

    try {
      const res = await getPublicationById(searchId.trim());
      setSelectedPublication(res.data);
      setDetailOpen(true);
      setError("");
    } catch {
      setError("Publicación no encontrada");
    }
  };

  // Cambiar estado
  const openStatus = (p) => {
    setSelectedPublication(p);
    setNewStatus(p.status);
    setStatusOpen(true);
  };

  const closeDialogs = () => {
    setContentOpen(false);
    setStatusOpen(false);
    setDetailOpen(false);
    setSelectedPublication(null);
    setNewStatus("");
    setSearchId("");
  };

  const copyId = () => {
    navigator.clipboard.writeText(selectedPublication.id);
  };

  const confirmStatusChange = async () => {
    try {
      const res = await changePublicationStatus(selectedPublication.id, newStatus);
      const updatedPublication = res.data;

      setSuccessMessage("Estado editorial actualizado correctamente");
      setTimeout(() => setSuccessMessage(""), 2000);

      setPublications((prev) =>
        prev.map((pub) => (pub.id === updatedPublication.id ? updatedPublication : pub))
      );
      closeDialogs();
    } catch {
      setError("No se pudo cambiar el estado editorial");
    }
  };

  // Badge visual para status (solo estilo)
  const statusBadgeSx = (status) => {
    const base = {
      display: "inline-flex",
      alignItems: "center",
      px: 1.2,
      py: 0.35,
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.3,
      border: "1px solid rgba(255,255,255,0.10)",
      background: "rgba(148,163,184,0.08)",
      color: "rgba(226,232,240,0.95)",
      whiteSpace: "nowrap",
    };

    if (status === "PUBLISHED")
      return { ...base, borderColor: "rgba(34,197,94,0.35)", background: "rgba(34,197,94,0.12)" };
    if (status === "APPROVED")
      return { ...base, borderColor: "rgba(6,182,212,0.35)", background: "rgba(6,182,212,0.12)" };
    if (status === "IN_REVIEW")
      return { ...base, borderColor: "rgba(245,158,11,0.35)", background: "rgba(245,158,11,0.12)" };
    if (status === "REJECTED")
      return { ...base, borderColor: "rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.12)" };
    if (status === "DRAFT")
      return { ...base, borderColor: "rgba(124,58,237,0.35)", background: "rgba(124,58,237,0.12)" };

    return base;
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(17,24,39,0.85)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 0.3 }}>
            Lista de Publicaciones
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Gestión editorial, contenido y estados
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1.5,
            py: 0.6,
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 800,
            border: "1px solid rgba(124,58,237,0.35)",
            background: "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(6,182,212,0.12))",
            color: "rgba(226,232,240,0.95)",
          }}
        >
          {publications.length} registradas
        </Box>
      </Box>

      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 2, borderRadius: 2, border: "1px solid rgba(34,197,94,0.25)" }}
        >
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2, border: "1px solid rgba(239,68,68,0.25)" }}
        >
          {error}
        </Alert>
      )}

      {/* BUSCAR POR ID */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          p: 2,
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(15,23,42,0.55)",
        }}
      >
        <TextField
          fullWidth
          label="Buscar publicación por ID (UUID)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={searchById}
          sx={{
            px: 2.5,
            borderRadius: 2,
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
            "&:hover": { filter: "brightness(1.05)" },
          }}
        >
          Buscar
        </Button>
      </Box>

      {/* TABLA */}
      <Box
        sx={{
          overflowX: "auto",
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Table
          sx={{
            minWidth: 1100,
            "& .MuiTableCell-root": {
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              verticalAlign: "top",
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(6,182,212,0.10))",
                "& th": {
                  fontWeight: 900,
                  letterSpacing: 0.3,
                  color: "rgba(226,232,240,0.95)",
                  whiteSpace: "nowrap",
                },
              }}
            >
              <TableCell>Título</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Resumen</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha publicación</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {publications.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    No existen publicaciones registradas
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {publications.map((p) => (
              <TableRow
                key={p.id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "rgba(148,163,184,0.06)" },
                }}
              >
                <TableCell sx={{ fontWeight: 800, maxWidth: 260 }}>
                  <Box sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.title}
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    ID: {String(p.id).slice(0, 8)}...
                  </Typography>
                </TableCell>

                <TableCell sx={{ color: "rgba(226,232,240,0.9)" }}>
                  {authorsMap[p.authorId]}
                </TableCell>

                <TableCell>
                  <Box
                    sx={{
                      display: "inline-flex",
                      px: 1.1,
                      py: 0.35,
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 900,
                      border: "1px solid rgba(6,182,212,0.30)",
                      background: "rgba(6,182,212,0.10)",
                      color: "rgba(226,232,240,0.95)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.tipoPublicacion}
                  </Box>
                </TableCell>

                <TableCell sx={{ color: "rgba(226,232,240,0.85)" }}>
                  {p.category}
                </TableCell>

                <TableCell sx={{ maxWidth: 320 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(226,232,240,0.85)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {p.summary}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={statusBadgeSx(p.status)}>{p.status}</Box>
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "-"}
                </TableCell>

                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => openContent(p)}
                    sx={{
                      mr: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 900,
                      px: 1.5,
                      border: "1px solid rgba(124,58,237,0.35)",
                      backgroundColor: "rgba(124,58,237,0.10)",
                      "&:hover": { backgroundColor: "rgba(124,58,237,0.18)" },
                    }}
                  >
                    Ver contenido
                  </Button>

                  <Button
                    size="small"
                    startIcon={<AutorenewIcon />}
                    onClick={() => openStatus(p)}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 900,
                      px: 1.5,
                      border: "1px solid rgba(6,182,212,0.28)",
                      backgroundColor: "rgba(6,182,212,0.10)",
                      "&:hover": { backgroundColor: "rgba(6,182,212,0.16)" },
                    }}
                  >
                    Cambiar estado
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* MODAL CONTENIDO */}
      <Dialog
        open={contentOpen}
        onClose={closeDialogs}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(17,24,39,0.92)",
            backdropFilter: "blur(12px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 900,
            background: "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(6,182,212,0.12))",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          Contenido de la Publicación
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {selectedPublication && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px dashed rgba(148,163,184,0.25)",
                  background: "rgba(15,23,42,0.55)",
                }}
              >
                <Box sx={{ overflow: "hidden" }}>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    ID (UUID)
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 900,
                      wordBreak: "break-all",
                      color: "rgba(226,232,240,0.95)",
                    }}
                  >
                    {selectedPublication.id}
                  </Typography>
                </Box>

                <Tooltip title="Copiar ID">
                  <IconButton
                    size="small"
                    onClick={copyId}
                    sx={{
                      borderRadius: 2,
                      border: "1px solid rgba(6,182,212,0.28)",
                      backgroundColor: "rgba(6,182,212,0.10)",
                      "&:hover": { backgroundColor: "rgba(6,182,212,0.16)" },
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography sx={{ mt: 1, fontWeight: 900 }}>Contenido:</Typography>
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(15,23,42,0.45)",
                }}
              >
                <Typography sx={{ whiteSpace: "pre-line", color: "rgba(226,232,240,0.9)" }}>
                  {selectedPublication.content}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Button
            onClick={closeDialogs}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 900,
              px: 2.2,
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(226,232,240,0.9)",
              "&:hover": { backgroundColor: "rgba(148,163,184,0.08)" },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL DETALLE COMPLETO */}
      <Dialog
        open={detailOpen}
        onClose={closeDialogs}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(17,24,39,0.92)",
            backdropFilter: "blur(12px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 900,
            background: "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(6,182,212,0.12))",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          Detalle completo de la Publicación
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {selectedPublication && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px dashed rgba(148,163,184,0.25)",
                  background: "rgba(15,23,42,0.55)",
                }}
              >
                <Box sx={{ overflow: "hidden" }}>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    ID (UUID)
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 900,
                      wordBreak: "break-all",
                      color: "rgba(226,232,240,0.95)",
                    }}
                  >
                    {selectedPublication.id}
                  </Typography>
                </Box>

                <Tooltip title="Copiar ID">
                  <IconButton
                    size="small"
                    onClick={copyId}
                    sx={{
                      borderRadius: 2,
                      border: "1px solid rgba(6,182,212,0.28)",
                      backgroundColor: "rgba(6,182,212,0.10)",
                      "&:hover": { backgroundColor: "rgba(6,182,212,0.16)" },
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ display: "grid", gap: 1.1 }}>
                <Typography>
                  <strong>Título:</strong> {selectedPublication.title}
                </Typography>
                <Typography>
                  <strong>Autor:</strong> {authorsMap[selectedPublication.authorId]}
                </Typography>
                <Typography>
                  <strong>Tipo:</strong> {selectedPublication.tipoPublicacion}
                </Typography>
                <Typography>
                  <strong>Categoría:</strong> {selectedPublication.category}
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  <strong>Resumen:</strong> {selectedPublication.summary}
                </Typography>

                <Typography sx={{ mt: 1, fontWeight: 900 }}>Contenido:</Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(15,23,42,0.45)",
                  }}
                >
                  <Typography sx={{ whiteSpace: "pre-line", color: "rgba(226,232,240,0.9)" }}>
                    {selectedPublication.content}
                  </Typography>
                </Box>

                <Typography sx={{ mt: 1 }}>
                  <strong>Estado:</strong> <Box component="span" sx={statusBadgeSx(selectedPublication.status)}>{selectedPublication.status}</Box>
                </Typography>

                <Typography>
                  <strong>Fecha publicación:</strong>{" "}
                  {selectedPublication.publishedAt
                    ? new Date(selectedPublication.publishedAt).toLocaleString()
                    : "-"}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Button
            onClick={closeDialogs}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 900,
              px: 2.2,
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(226,232,240,0.9)",
              "&:hover": { backgroundColor: "rgba(148,163,184,0.08)" },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL CAMBIO DE ESTADO */}
      <Dialog
        open={statusOpen}
        onClose={closeDialogs}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(17,24,39,0.92)",
            backdropFilter: "blur(12px)",
            minWidth: 360,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 900,
            background: "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(6,182,212,0.12))",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          Cambiar estado editorial
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            sx={{
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.18)",
              },
            }}
          >
            {editorialStatuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>

          {selectedPublication && (
            <Typography variant="caption" sx={{ display: "block", mt: 1.5, color: "text.secondary" }}>
              Publicación: <strong>{selectedPublication.title}</strong>
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Button
            onClick={closeDialogs}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 900,
              px: 2.2,
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(226,232,240,0.9)",
              "&:hover": { backgroundColor: "rgba(148,163,184,0.08)" },
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={confirmStatusChange}
            sx={{
              borderRadius: 2,
              px: 2.4,
              fontWeight: 900,
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
              "&:hover": { filter: "brightness(1.05)" },
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PublicationList;



