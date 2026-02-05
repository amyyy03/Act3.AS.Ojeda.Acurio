import { useEffect, useState } from "react";
import { getAllAuthors, getAuthorById } from "../../api/authorApi";
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const AuthorList = ({ refresh }) => {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");
  const [openDetail, setOpenDetail] = useState(false);

  // Listar autores
  useEffect(() => {
    getAllAuthors()
      .then((res) => {
        setAuthors(res.data || []);
        setError("");
      })
      .catch(() => setError("No se pudo conectar con el servicio de autores"));
  }, [refresh]);

  // Ver detalle
  const viewDetail = async (id) => {
    try {
      const res = await getAuthorById(id);
      setSelectedAuthor(res.data);
      setOpenDetail(true);
      setError("");
    } catch {
      setError("No se pudo obtener el detalle del autor");
    }
  };

  // Buscar por ID
  const searchById = () => {
    if (!searchId.trim()) return;
    viewDetail(searchId.trim());
  };

  const closeDialog = () => {
    setOpenDetail(false);
    setSelectedAuthor(null);
    setSearchId("");
  };

  const copyId = () => {
    navigator.clipboard.writeText(selectedAuthor.id);
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
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 0.3 }}>
            Lista de Autores
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Consulta rápida y detalle por UUID
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1.5,
            py: 0.6,
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            border: "1px solid rgba(124,58,237,0.35)",
            background: "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(6,182,212,0.12))",
            color: "rgba(226,232,240,0.95)",
          }}
        >
          {authors.length} registrados
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
            border: "1px solid rgba(239,68,68,0.35)",
          }}
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
          label="Buscar autor por ID (UUID)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
          }}
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
            minWidth: 900,
            "& .MuiTableCell-root": {
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(6,182,212,0.10))",
                "& th": {
                  fontWeight: 800,
                  letterSpacing: 0.3,
                  color: "rgba(226,232,240,0.95)",
                },
              }}
            >
              <TableCell>Nombre</TableCell>
              <TableCell>Identificación</TableCell>
              <TableCell>Nacionalidad</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Género</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {authors.length === 0 && !error && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography sx={{ color: "text.secondary" }}>
                    No existen autores registrados
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {authors.map((a) => (
              <TableRow
                key={a.id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "rgba(148,163,184,0.06)" },
                }}
              >
                <TableCell sx={{ fontWeight: 700 }}>
                  {a.nombre} {a.apellido}
                </TableCell>

                <TableCell sx={{ color: "rgba(226,232,240,0.9)" }}>
                  {a.tipoIdentificacion} - {a.identificacion}
                </TableCell>

                <TableCell sx={{ color: "rgba(226,232,240,0.85)" }}>
                  {a.nacionalidad}
                </TableCell>

                <TableCell sx={{ color: "rgba(226,232,240,0.85)" }}>
                  {a.email}
                </TableCell>

                <TableCell sx={{ color: "rgba(226,232,240,0.85)" }}>
                  {a.telefono}
                </TableCell>

                <TableCell>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      border: "1px solid rgba(6,182,212,0.30)",
                      background: "rgba(6,182,212,0.10)",
                      color: "rgba(226,232,240,0.95)",
                    }}
                  >
                    {a.generoLiterario}
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => viewDetail(a.id)}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 800,
                      px: 1.5,
                      border: "1px solid rgba(124,58,237,0.35)",
                      backgroundColor: "rgba(124,58,237,0.10)",
                      "&:hover": { backgroundColor: "rgba(124,58,237,0.18)" },
                    }}
                  >
                    Ver detalle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* MODAL DETALLE */}
      <Dialog
        open={openDetail}
        onClose={closeDialog}
        maxWidth="sm"
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
          Detalle del Autor
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {selectedAuthor && (
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
                      fontWeight: 800,
                      wordBreak: "break-all",
                      color: "rgba(226,232,240,0.95)",
                    }}
                  >
                    {selectedAuthor.id}
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
                  <strong>Nombre:</strong> {selectedAuthor.nombre} {selectedAuthor.apellido}
                </Typography>
                <Typography>
                  <strong>Identificación:</strong> {selectedAuthor.tipoIdentificacion} - {selectedAuthor.identificacion}
                </Typography>
                <Typography>
                  <strong>Nacionalidad:</strong> {selectedAuthor.nacionalidad}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {selectedAuthor.email}
                </Typography>
                <Typography>
                  <strong>Teléfono:</strong> {selectedAuthor.telefono}
                </Typography>
                <Typography>
                  <strong>Género literario:</strong> {selectedAuthor.generoLiterario}
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  <strong>Biografía:</strong> {selectedAuthor.biografia || "No registrada"}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Button
            onClick={closeDialog}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
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
    </Paper>
  );
};

export default AuthorList;

