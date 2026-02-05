import { Typography, Box, Paper } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 4,
          textAlign: "center",
          maxWidth: 700,
          width: "100%",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(17,24,39,0.85)",
          backdropFilter: "blur(10px)",
        }}
      >
        <MenuBookIcon
          sx={{
            fontSize: 140,
            mb: 2,
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            letterSpacing: 0.5,
            mb: 1,
          }}
        >
          Plataforma de Gestión Editorial
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
          Administra información de autores, organiza publicaciones y supervisa el flujo editorial de forma centralizada.
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "rgba(148,163,184,0.8)",
            letterSpacing: 1,
          }}
        >
          Sistema académico · Arquitectura de microservicios
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home;
