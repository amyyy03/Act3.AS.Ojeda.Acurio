import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(90deg, #0f172a, #1e293b)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* Marca / Nombre del sistema */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            fontWeight: 800,
            letterSpacing: 1,
            background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Sistema Editorial
        </Typography>

        {/* Navegación */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={Link}
            to="/authors"
            sx={{
              color: "#e2e8f0",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": { backgroundColor: "rgba(124,58,237,0.15)" },
            }}
          >
            Gestión de Autores
          </Button>

          <Button
            component={Link}
            to="/publications"
            sx={{
              color: "#e2e8f0",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": { backgroundColor: "rgba(6,182,212,0.15)" },
            }}
          >
            Panel de Publicaciones
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

