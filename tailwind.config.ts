import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: '#38318b',
      secondary: '#27183e',
      accent: '#df6552',
      background: '#f6f1ed'
    }
  },
  plugins: [],
};
export default config;
