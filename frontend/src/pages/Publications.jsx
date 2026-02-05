import { useState } from "react";
import { Container, Typography, Box, Paper, Divider } from "@mui/material";

import PublicationForm from "../components/publications/PublicationForm";
import PublicationList from "../components/publications/PublicationList";

const Publications = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 6 }}>
      
      {/* Encabezado */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(17,24,39,0.85)",
          backdropFilter: "blur(8px)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            letterSpacing: 0.5,
            background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Gestión de Contenido Editorial
        </Typography>

        <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
          Registro, seguimiento y control de publicaciones dentro del flujo editorial.
        </Typography>
      </Paper>

      {/* Formulario */}
      <Box sx={{ mb: 4 }}>
        <PublicationForm onPublicationCreated={() => setRefresh(!refresh)} />
      </Box>

      <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.08)" }} />

      {/* Listado */}
      <PublicationList refresh={refresh} />
    </Container>
  );
};

export default Publications;


