// src/constants/theme.ts
export const COLORS = {
  primary: "#7C5CFC",
  primaryLight: "#EDE8FF",
  primaryDark: "#5438D0",
  primaryGlow: "#7C5CFC30",

  coral: "#FF6B52",
  coralLight: "#FFF0ED",

  gold: "#F5B942",

  bg: "#0D0D0F",
  bgCard: "#18181C",
  bgElevated: "#222228",
  bgSheet: "#1C1C22",

  text: "#F5F4F2",
  textSecondary: "#9A98A6",
  textTertiary: "#5E5C6E",

  border: "#2C2C38",
  borderLight: "#3A3A4A",

  success: "#3DD68C",
  successBg: "#0F2E1E",
  error: "#FF5A5A",
  errorBg: "#2E0F0F",
  warning: "#F5B942",
  warningBg: "#2E220F",
};

export const TALENT_COLORS: Record<string, { bg: string; text: string }> = {
  singing:     { bg: "#1E1640", text: "#A78BFA" },
  dancing:     { bg: "#2E1028", text: "#F472B6" },
  cooking:     { bg: "#2E1800", text: "#FB923C" },
  art:         { bg: "#0F2E1E", text: "#34D399" },
  photography: { bg: "#0F1E2E", text: "#38BDF8" },
  comedy:      { bg: "#2E2800", text: "#FACC15" },
  fitness:     { bg: "#1E2E10", text: "#86EFAC" },
  fashion:     { bg: "#2E1020", text: "#F9A8D4" },
  music:       { bg: "#1A1040", text: "#818CF8" },
  poetry:      { bg: "#201020", text: "#D8B4FE" },
  default:     { bg: "#222228", text: "#9A98A6" },
};

export const TALENT_BADGE = (slug: string): { bg: string; text: string } =>
  TALENT_COLORS[slug] ?? TALENT_COLORS.default;

export const TALENT_ICONS: Record<string, string> = {
  singing:     "musical-note-outline",
  dancing:     "body-outline",
  cooking:     "restaurant-outline",
  art:         "brush-outline",
  photography: "camera-outline",
  comedy:      "happy-outline",
  fitness:     "barbell-outline",
  fashion:     "shirt-outline",
  music:       "musical-notes-outline",
  poetry:      "pencil-outline",
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const SHADOW = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
};
