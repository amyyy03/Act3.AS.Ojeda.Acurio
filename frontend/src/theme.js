import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#7c3aed", // morado moderno
    },
    secondary: {
      main: "#06b6d4", // cyan vibrante
    },

    background: {
      default: "#0f172a", // azul noche profundo
      paper: "#111827",
    },

    text: {
      primary: "#e2e8f0",
      secondary: "#94a3b8",
    },

    success: { main: "#22c55e" },
    error: { main: "#ef4444" },
    warning: { main: "#f59e0b" },
    info: { main: "#38bdf8" },
  },

  typography: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",

    h4: {
      fontWeight: 700,
      letterSpacing: "0.5px",
    },

    h5: {
      fontWeight: 600,
    },

    body1: {
      fontSize: "0.95rem",
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.5px",
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 18px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
          boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
          transition: "all 0.25s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#111827",
          border: "1px solid rgba(255,255,255,0.05)",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(17, 24, 39, 0.85)",
          backdropFilter: "blur(10px)",
        },
      },
    },
  },
});

