// SALAH REMINDER ☪ — Brand Design Tokens
// Generated from locked color system

export const brand = {
  name: "Salah Reminder",
  tagline: "never miss a prayer",
  icon: "☪",

  palette: {
    // PALETTE 01 — FOUNDATION / PRIMARY UI
    foundation: {
      amaranth: "#933B5B",
      thulianPink: "#B5728A",
      brookGreen: "#AABAAE",
      chalk: "#E3D6BF",
      pomeloOlive: "#9F9679",
    },

    // PALETTE 02 — SOFT / INTERACTIVE ACCENTS
    accents: {
      verandaBlue: "#6BB1AD",
      skyCloud: "#A7BCBD",
      lychee: "#EDECDB",
      melon: "#E5A9A9",
      cupidPink: "#E6748E",
    },

    // PALETTE 03 — DEEP / EMOTIONAL / NIGHT
    deep: {
      warmPeach: "#FCC59E",
      coral: "#FF9F9A",
      rose: "#E66277",
      deepRose: "#AD4161",
      wineRose: "#8F3858",
      deepPlum: "#562747",
    },
  },

  // Semantic color assignments
  semantic: {
    // Day mode
    background: "#E3D6BF", // Chalk
    surface: "#EDECDB", // Lychee
    primary: "#933B5B", // Amaranth
    secondary: "#B5728A", // Thulian Pink
    muted: "#AABAAE", // Brook Green
    olive: "#9F9679", // Pomelo Olive
    accent: "#6BB1AD", // Veranda Blue
    softAccent: "#A7BCBD", // Sky Cloud

    // Night mode
    nightBackground: "#562747", // Deep Plum
    nightSurface: "#8F3858", // Wine Rose
    nightAccent: "#AD4161", // Deep Rose
    nightHighlight: "#E66277", // Rose
    nightWarm: "#FCC59E", // Warm Peach
    nightCoral: "#FF9F9A", // Coral

    // Text
    textPrimary: "#562747", // Deep Plum on light
    textSecondary: "#933B5B", // Amaranth on light
    textMuted: "#9F9679", // Pomelo Olive on light
    textOnDark: "#E3D6BF", // Chalk on dark
    textOnDarkSecondary: "#EDECDB", // Lychee on dark
  },

  // Typography (temporary - not finalized per prompt)
  typography: {
    primary: "Georgia, serif",
    secondary: "system-ui, sans-serif",
    mono: "monospace",
  },

  // Spacing system
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
    "4xl": "96px",
  },

  // Border radius
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },

  // Shadows
  shadows: {
    soft: "0 2px 8px rgba(86, 39, 71, 0.06)",
    medium: "0 4px 16px rgba(86, 39, 71, 0.08)",
    deep: "0 8px 32px rgba(86, 39, 71, 0.12)",
  },
} as const;

export type Brand = typeof brand;
