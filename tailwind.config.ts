import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          void: "#030712",
          deep: "#060D1F",
          panel: "#0B152E",
          card: "rgba(11, 21, 46, 0.75)",
          border: "rgba(0, 240, 255, 0.2)",
        },
        hud: {
          cyan: "#00F0FF",
          amber: "#FFB800",
          lime: "#39FF14",
          rose: "#FF2A6D",
          purple: "#A855F7",
        },
      },
      borderRadius: {
        hud: "16px",
      },
      boxShadow: {
        "hud-cyan": "0 0 20px rgba(0, 240, 255, 0.35)",
        "hud-amber": "0 0 20px rgba(255, 184, 0, 0.35)",
        "hud-lime": "0 0 20px rgba(57, 255, 20, 0.35)",
        "hud-glow": "0 0 25px rgba(0, 240, 255, 0.15), inset 0 0 15px rgba(0, 240, 255, 0.05)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s infinite ease-in-out",
        "spin-slow": "spin 20s linear infinite",
        "spin-reverse": "spinReverse 15s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.85", filter: "drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 18px rgba(0, 240, 255, 0.95))" },
        },
        spinReverse: {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
