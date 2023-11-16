import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        palette_blue: "#152033",
        palette_orange: "#F2C050",
        palette_grey: "#717883",
        palette_white: "#FFFFFF",
        palette_black: "#000000",
        palette_error: "#f44336",
        palette_warning: "#ffa726",
        palette_info: "#29b6f6",
        palette_success: "#66bb6a",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
