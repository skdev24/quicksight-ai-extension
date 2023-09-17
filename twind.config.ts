import { defineConfig } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetLineClamp from "@twind/preset-line-clamp";

export default defineConfig({
  darkMode: "class",
  presets: [presetAutoprefix(), presetTailwind(), presetLineClamp()],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        noble: {
          100: "#E8E9E9",
          200: "#CDCECF",
          300: "#9B9C9E",
          400: "#686B6E",
          500: "#363A3D",
          600: "#1A1D21",
          700: "#131619",
          800: "#0D0F10",
          900: "#060708",
        },
      },
    },
  },
  preflight: {
    "@import":
      "url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap')",
    "@font-face": [
      {
        "font-family": "Plus Jakarta Sans",
        "font-style": "normal",
        "font-weight": "400",
        "font-display": "swap",
        src: "local('Plus Jakarta Sans'), local('PlusJakartaSans-Regular'), url(https://fonts.gstatic.com/s/plusjakartasans/v1/6ae9a3b7-5b7a-4b7a-8b0d-4b8b5b0b6b7b.woff2) format('woff2')",
      },
      {
        "font-family": "Plus Jakarta Sans",
        "font-style": "normal",
        "font-weight": "500",
        "font-display": "swap",
        src: "local('Plus Jakarta Sans Medium'), local('PlusJakartaSans-Medium'), url(https://fonts.gstatic.com/s/plusjakartasans/v1/6ae9a3b7-5b7a-4b7a-8b0d-4b8b5b0b6b7b.woff2) format('woff2')",
      },
      {
        "font-family": "Plus Jakarta Sans",
        "font-style": "normal",
        "font-weight": "600",
        "font-display": "swap",
        src: "local('Plus Jakarta Sans SemiBold'), local('PlusJakartaSans-SemiBold'), url(https://fonts.gstatic.com/s/plusjakartasans/v1/6ae9a3b7-5b7a-4b7a-8b0d-4b8b5b0b6b7b.woff2) format('woff2')",
      },
      {
        "font-family": "Plus Jakarta Sans",
        "font-style": "normal",
        "font-weight": "700",
        "font-display": "swap",
        src: "local('Plus Jakarta Sans Bold'), local('PlusJakartaSans-Bold'), url(https://fonts.gstatic.com/s/plusjakartasans/v1/6ae9a3b7-5b7a-4b7a-8b0d-4b8b5b0b6b7b.woff2) format('woff2')",
      },
    ],
  },
});
