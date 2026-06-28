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
        chad: {
          bg: "#09090B",
          card: "#18181B",
          border: "#27272A",
          accent: "#6D5BFF",
          "accent-end": "#9B8CFF",
          muted: "#A1A1AA",
          green: "#22C55E",
          red: "#EF4444",
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "marquee-reverse": "marquee-reverse 35s linear infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
      },
      backgroundImage: {
        "chad-gradient": "linear-gradient(135deg, #6D5BFF, #9B8CFF)",
      },
    },
  },
  plugins: [],
};
export default config;
