import type { Config } from "tailwindcss";

const variableColor = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: variableColor("ink"),
        deep: variableColor("deep"),
        paper: variableColor("paper"),
        mist: variableColor("mist"),
        card: variableColor("card"),
        line: variableColor("line"),
        aqua: variableColor("aqua"),
        marine: variableColor("marine"),
        splash: variableColor("splash"),
        cream: variableColor("cream"),
        "cream-line": variableColor("cream-line"),
        muted: variableColor("muted"),
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "Menlo", "monospace"],
      },
      keyframes: {
        cue: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(5px)" },
        },
        rise2: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "18%": { opacity: "0.75" },
          "100%": { transform: "translateY(-190px)", opacity: "0" },
        },
        rise: {
          "0%": { transform: "translateY(30px) scale(0.9)", opacity: "0" },
          "20%": { opacity: "0.6" },
          "100%": { transform: "translateY(-120px) scale(1.1)", opacity: "0" },
        },
      },
      animation: {
        cue: "cue 1.7s ease-in-out infinite",
        rise2: "rise2 9s linear infinite",
        rise: "rise 9s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
