import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#E9E1D8",
        ivory: "#FAF7F2",
        taupe: "#B9A38E",
        walnut: "#8A6042",
        graphite: "#262321",
        mist: "#ECE6DF"
      },
      fontFamily: {
        sans: ["var(--font-manrope)"],
        serif: ["var(--font-cormorant)"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(20, 16, 11, 0.08)"
      },
      letterSpacing: {
        logo: "0.5em"
      },
      borderRadius: {
        xl: "1.25rem"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(255,255,255,0.9), rgba(250,247,242,0.86) 45%, rgba(233,225,216,0.65) 100%)"
      }
    }
  },
  plugins: []
};

export default config;
