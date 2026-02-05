import { useMemo, useState } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Alert,
  Paper,
  Grid,
  Divider,
  Stack,
  Collapse,
  InputAdornment,
} from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PublicIcon from "@mui/icons-material/Public";
import { createAuthor } from "../../api/authorApi";

const initialState = {
  tipoIdentificacion: "",
  identificacion: "",
  nacionalidad: "",
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  biografia: "",
  generoLiterario: "",
};

const tiposId = [
  { value: "CEDULA", label: "Cédula" },
  { value: "PASAPORTE", label: "Pasaporte" },
  { value: "RUC", label: "RUC" },
];

const generos = [
  "Narrativa",
  "Poesía",
  "Ensayo",
  "Teatro",
  "Ciencia ficción",
  "Fantasía",
  "Romance",
  "Terror",
  "No ficción",
];

const emailRegex = /^\S+@\S+\.\S+$/;

const AuthorForm = ({ onAuthorCreated }) => {
  const [author, setAuthor] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const requiredFields = useMemo(
    () => [
      "tipoIdentificacion",
      "identificacion",
      "nacionalidad",
      "nombre",
      "apellido",
      "email",
      "telefono",
      "generoLiterario",
    ],
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAuthor((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
    setSuccessMessage("");
  };

  const validate = () => {
    const newErrors = {};

    for (const field of requiredFields) {
      if (!String(author[field] ?? "").trim()) newErrors[field] = "Campo obligatorio";
    }

    if (author.email && !emailRegex.test(author.email.trim())) {
      newErrors.email = "Correo no válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const cleanPayload = () => ({
    ...author,
    tipoIdentificacion: author.tipoIdentificacion.trim(),
    identificacion: author.identificacion.trim(),
    nombre: author.nombre.trim(),
    apellido: author.apellido.trim(),
    email: author.email.trim(),
    telefono: author.telefono.trim(),
    nacionalidad: author.nacionalidad.trim(),
    generoLiterario: author.generoLiterario.trim(),
    biografia: author.biografia?.trim() || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await createAuthor(cleanPayload());
      onAuthorCreated?.();

      setSuccessMessage("✅ Autor creado correctamente");
      setAuthor(initialState);
      setErrors({});
      setServerError("");

      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      if (error?.response) {
        const { status, data } = error.response;

        if (status === 400 && data?.messages) {
          setErrors(data.messages);
        } else if (data?.message) {
          setServerError(data.message);
        } else {
          setServerError("Error inesperado");
        }
      } else {
        setServerError("No se pudo conectar con el servidor");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setAuthor(initialState);
    setErrors({});
    setServerError("");
    setSuccessMessage("");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 0.3 }}>
            Registro de Autor
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Completa los datos principales y guarda el autor en el sistema.
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Collapse in={!!successMessage}>
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        </Collapse>

        <Collapse in={!!serverError}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        </Collapse>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Tipo de identificación"
              name="tipoIdentificacion"
              fullWidth
              value={author.tipoIdentificacion}
              onChange={handleChange}
              error={!!errors.tipoIdentificacion}
              helperText={errors.tipoIdentificacion}
            >
              {tiposId.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Número de identificación"
              name="identificacion"
              fullWidth
              value={author.identificacion}
              onChange={handleChange}
              error={!!errors.identificacion}
              helperText={errors.identificacion}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Nombre"
              name="nombre"
              fullWidth
              value={author.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Apellido"
              name="apellido"
              fullWidth
              value={author.apellido}
              onChange={handleChange}
              error={!!errors.apellido}
              helperText={errors.apellido}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={author.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Teléfono"
              name="telefono"
              fullWidth
              value={author.telefono}
              onChange={handleChange}
              error={!!errors.telefono}
              helperText={errors.telefono}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphoneIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Nacionalidad"
              name="nacionalidad"
              fullWidth
              value={author.nacionalidad}
              onChange={handleChange}
              error={!!errors.nacionalidad}
              helperText={errors.nacionalidad}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PublicIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Género literario"
              name="generoLiterario"
              fullWidth
              value={author.generoLiterario}
              onChange={handleChange}
              error={!!errors.generoLiterario}
              helperText={errors.generoLiterario}
            >
              {generos.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Biografía (opcional)"
              name="biografia"
              fullWidth
              multiline
              minRows={3}
              value={author.biografia}
              onChange={handleChange}
              placeholder="Escribe una breve biografía del autor..."
            />
          </Grid>
        </Grid>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<PostAddIcon />}
            disabled={saving}
            sx={{
              px: 2.5,
              py: 1.1,
              borderRadius: 2,
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              "&:hover": {
                filter: "brightness(1.05)",
              },
            }}
          >
            {saving ? "Guardando..." : "Guardar Autor"}
          </Button>

          <Button
            type="button"
            variant="outlined"
            onClick={handleReset}
            sx={{ px: 2.5, py: 1.1, borderRadius: 2 }}
          >
            Limpiar
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default AuthorForm;
