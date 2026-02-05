import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Alert,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { createPublication } from "../../api/publicationApi";
import { getAllAuthors } from "../../api/authorApi";

const initialState = {
  title: "",
  authorId: "",
  summary: "",
  content: "",
  tipoPublicacion: "",
  category: "",
};

const PublicationForm = ({ onPublicationCreated }) => {
  const [publication, setPublication] = useState(initialState);
  const [authors, setAuthors] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    getAllAuthors()
      .then((res) => setAuthors(res.data))
      .catch(() => setServerError("No se pudo cargar la lista de autores"));
  }, []);

  const handleChange = (e) => {
    setPublication({ ...publication, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
    setSuccessMessage("");
  };

  const validate = () => {
    const newErrors = {};

    if (!publication.title) newErrors.title = "Campo obligatorio";
    if (!publication.authorId) newErrors.authorId = "Seleccione un autor";
    if (!publication.summary) newErrors.summary = "Campo obligatorio";
    if (!publication.content) newErrors.content = "Campo obligatorio";
    if (!publication.tipoPublicacion) newErrors.tipoPublicacion = "Campo obligatorio";
    if (!publication.category) newErrors.category = "Campo obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const cleanPublication = {
      ...publication,
      title: publication.title.trim(),
      summary: publication.summary.trim(),
      content: publication.content.trim(),
      category: publication.category.trim(),
    };

    try {
      await createPublication(cleanPublication);
      onPublicationCreated?.();

      setSuccessMessage("Publicación creada correctamente");

      setTimeout(() => setSuccessMessage(""), 4000);

      setPublication(initialState);
      setErrors({});
      setServerError("");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data.messages) {
          setErrors(data.messages);
        } else if (data.message) {
          setServerError(data.message);
        } else {
          setServerError("Error inesperado");
        }
      } else {
        setServerError("No se pudo conectar con el servidor");
      }
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(17,24,39,0.85)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={0.5}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Crear Publicación
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Registra contenido editorial dentro del sistema
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {successMessage}
          </Alert>
        )}

        {serverError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {serverError}
          </Alert>
        )}

        <TextField
          required
          label="Título"
          name="title"
          fullWidth
          margin="normal"
          value={publication.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />

        <TextField
          select
          required
          label="Autor"
          name="authorId"
          fullWidth
          margin="normal"
          value={publication.authorId}
          onChange={handleChange}
          error={!!errors.authorId}
          helperText={
            authors.length === 0
              ? "Debe crear al menos un autor antes de registrar publicaciones"
              : errors.authorId
          }
          disabled={authors.length === 0}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        >
          {authors.map((a) => (
            <MenuItem key={a.id} value={a.id}>
              {a.nombre} {a.apellido}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          required
          label="Resumen"
          name="summary"
          fullWidth
          margin="normal"
          multiline
          rows={2}
          value={publication.summary}
          onChange={handleChange}
          error={!!errors.summary}
          helperText={errors.summary}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />

        <TextField
          required
          label="Contenido"
          name="content"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={publication.content}
          onChange={handleChange}
          error={!!errors.content}
          helperText={errors.content}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />

        <TextField
          select
          required
          label="Tipo de publicación"
          name="tipoPublicacion"
          fullWidth
          margin="normal"
          value={publication.tipoPublicacion}
          onChange={handleChange}
          error={!!errors.tipoPublicacion}
          helperText={errors.tipoPublicacion}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        >
          <MenuItem value="ARTICULO">Artículo</MenuItem>
          <MenuItem value="LIBRO">Libro</MenuItem>
          <MenuItem value="INVESTIGACION">Investigación</MenuItem>
          <MenuItem value="INFORME">Informe</MenuItem>
          <MenuItem value="OTRO">Otro</MenuItem>
        </TextField>

        <TextField
          required
          label="Categoría"
          name="category"
          fullWidth
          margin="normal"
          value={publication.category}
          onChange={handleChange}
          error={!!errors.category}
          helperText={errors.category}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />

        <Button
          type="submit"
          variant="contained"
          startIcon={<PostAddIcon />}
          sx={{
            mt: 2,
            borderRadius: 2,
            px: 3,
            py: 1.1,
            fontWeight: 700,
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
            "&:hover": { filter: "brightness(1.05)" },
          }}
        >
          Guardar Publicación
        </Button>
      </Box>
    </Paper>
  );
};

export default PublicationForm;

