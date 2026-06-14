import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,md,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,md,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ink: {
                    DEFAULT: "#070711",
                    50: "#0b0b18",
                    100: "#10101f",
                    200: "#16162a",
                    300: "#1e1e38",
                },
                brand: {
                    DEFAULT: "#7c5cff",
                    soft: "#9d86ff",
                    deep: "#5b3df0",
                },
                aurora: {
                    violet: "#7c5cff",
                    indigo: "#4f46e5",
                    cyan: "#22d3ee",
                    teal: "#2dd4bf",
                    pink: "#f472b6",
                    amber: "#fbbf24",
                },
            },
            fontFamily: {
                sans: ["var(--font-sans)", "system-ui", "sans-serif"],
                display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
                mono: ["var(--font-mono)", "ui-monospace", "monospace"],
            },
            borderRadius: {
                "4xl": "2rem",
                "5xl": "2.5rem",
            },
            boxShadow: {
                glow: "0 0 0 1px rgba(124,92,255,0.18), 0 18px 50px -12px rgba(124,92,255,0.45)",
                "glow-cyan": "0 0 0 1px rgba(34,211,238,0.18), 0 18px 50px -12px rgba(34,211,238,0.4)",
                glass: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
            },
            backgroundImage: {
                "aurora-grad":
                    "linear-gradient(120deg,#7c5cff 0%,#22d3ee 40%,#f472b6 75%,#fbbf24 100%)",
                "grid-fade":
                    "linear-gradient(to right,rgba(124,92,255,0.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(124,92,255,0.07) 1px,transparent 1px)",
            },
            keyframes: {
                aurora: {
                    "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
                    "33%": { transform: "translate3d(4%,-6%,0) scale(1.15)" },
                    "66%": { transform: "translate3d(-5%,4%,0) scale(0.95)" },
                },
                float: {
                    "0%,100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                shimmer: {
                    "100%": { transform: "translateX(100%)" },
                },
                "fade-up": {
                    "0%": { opacity: "0", transform: "translateY(16px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "gradient-x": {
                    "0%,100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                },
                "spin-slow": {
                    to: { transform: "rotate(360deg)" },
                },
            },
            animation: {
                "aurora-1": "aurora 18s ease-in-out infinite",
                "aurora-2": "aurora 24s ease-in-out infinite reverse",
                "aurora-3": "aurora 30s ease-in-out infinite",
                float: "float 6s ease-in-out infinite",
                shimmer: "shimmer 2.5s infinite",
                "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
                "gradient-x": "gradient-x 6s ease infinite",
                "spin-slow": "spin-slow 14s linear infinite",
            },
        },
    },
    plugins: [],
};
export default config;
