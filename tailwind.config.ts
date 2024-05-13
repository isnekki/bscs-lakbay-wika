import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "island-background": "url('../assets/images/background.png')"
      },
      fontFamily: {
        'sf-black': ['SF-Black'],
        'sf-black-italic': ['SF-Black-Italic'],
        'sf-bold': ['SF-Bold'],
        'sf-bold-italic': ['SF-Bold-Italic'],
        'sf-heavy': ['SF-Heavy'],
        'sf-heavy-italic': ['SF-Heavy-Italic'],
        'sf-light': ['SF-Light'],
        'sf-light-italic': ['SF-Light-Italic'],
        'sf-medium': ['SF-Medium'],
        'sf-medium-italic': ['SF-Medium-Italic'],
        'sf-regular': ['SF-Regular'],
        'sf-regular-italic': ['SF-Regular-Italic'],
        'sf-semibold': ['SF-Semibold'],
        'sf-semibold-italic': ['SF-Semibold-Italic'],
        'sf-thin': ['SF-Thin'],
        'sf-thin-italic': ['SF-Thin-Italic'],
        'sf-ultralight': ['SF-Ultralight'],
        'sf-ultralight-italic': ['SF-Ultralight-Italic']
      },
      borderWidth: {
        '2.5': '2.5px'
      },
      height: {
        'register':'500px'
      }
    },
  },
  plugins: [],
};
export default config;
