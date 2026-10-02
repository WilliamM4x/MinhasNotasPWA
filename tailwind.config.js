/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#003629",
        "primary-container": "#1b4d3e",
        "on-primary": "#ffffff",
        "on-primary-container": "#8abda9",
        "primary-fixed": "#baeed9",
        "primary-fixed-dim": "#9ed1bd",
        "secondary": "#2b6955",
        "secondary-container": "#b0f0d6",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#326f5b",
        "tertiary": "#003627",
        "tertiary-container": "#004f3a",
        "surface": "#f7faf6",
        "surface-bright": "#f7faf6",
        "surface-dim": "#d8dbd7",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f4f1",
        "surface-container": "#ecefeb",
        "surface-container-high": "#e6e9e5",
        "surface-container-highest": "#e0e3e0",
        "on-surface": "#181c1a",
        "on-surface-variant": "#404945",
        "outline": "#707974",
        "outline-variant": "#c0c9c3",
        "error": "#ba1a1a",
        "error-container": "#ffdad6"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "0.75rem",
        "space-lg": "1.25rem",
        "space-xl": "2rem",
        "margin": "1rem",
        "gutter": "1rem",
        "margin-tablet": "2rem",
        "gutter-desktop": "1.5rem",
        "margin-desktop": "3rem"
      },
      fontFamily: {
        "display": ["Geist", "sans-serif"],
        "headline-lg": ["Geist", "sans-serif"],
        "headline-md": ["Geist", "sans-serif"],
        "headline-lg-mobile": ["Geist", "sans-serif"],
        "title-sm": ["Geist", "sans-serif"],
        "body-lg": ["Geist", "sans-serif"],
        "body-md": ["Geist", "sans-serif"],
        "body-sm": ["Geist", "sans-serif"],
        "label-md": ["Geist", "sans-serif"],
        "label-sm": ["Geist", "sans-serif"]
      },
      fontSize: {
        "display": ["36px", { lineHeight: "44px", letterSpacing: "-0.03em", fontWeight: "600" }],
        "headline-lg": ["30px", { lineHeight: "38px", letterSpacing: "-0.025em", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-md": ["20px", { lineHeight: "28px", letterSpacing: "-0.015em", fontWeight: "500" }],
        "title-sm": ["16px", { lineHeight: "24px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "-0.005em", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
        "label-md": ["13px", { lineHeight: "18px", letterSpacing: "0.01em", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "16px", letterSpacing: "0.03em", fontWeight: "600" }]
      }
    },
  },
  plugins: [],
}
