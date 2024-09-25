import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      primary: '#38318b',
      secondary: '#27183e',
      accent: '#df6552',
      background: '#f6f1ed',
      white: colors.white,
      black: colors.black,
      zinc: colors.zinc,
      gray: '#ADAAA7',
      // red: '#ff1411',
      transparent: 'transparent',
    },
  },
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: '#38318b',
          secondary: '#27183e',
        },
      },
      dark: {
        colors: {
          primary: '#38318b',
          secondary: '#27183e',
        },
      },
    },
  })],
};
export default config;
