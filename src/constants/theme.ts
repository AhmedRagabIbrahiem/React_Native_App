/** Design tokens from Design_html (Material-style palette) */
export const colors = {
  background: "#faf9f6",
  surface: "#faf9f6",
  surfaceContainerLow: "#f4f3f1",
  secondaryContainer: "#efe0cd",
  primary: "#33210d",
  primaryContainer: "#4b3621",
  onPrimary: "#ffffff",
  onPrimaryContainer: "#bd9f83",
  onSurface: "#1a1c1a",
  onSurfaceVariant: "#4e453d",
  onSecondaryContainer: "#6d6354",
  tertiaryContainer: "#164313",
  onTertiaryContainer: "#7fb174",
  outline: "#80756c",
  outlineVariant: "#d2c4ba",
  accent: "#4b3621",
  text: "#1a1c1a",
  textMuted: "#4e453d",
  border: "#d2c4ba",
  button: "#4b3621",
  buttonText: "#ffffff",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  marginMobile: 16,
  gutter: 24,
} as const;

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  headline: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  label: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
} as const;
