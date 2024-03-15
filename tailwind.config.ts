import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

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
        palette_light_grey: "#E3E3E3",
        palette_light_grey_2: "#D9D9D9",
        palette_light_blue: "#1C64F2",
        palette_white: "#FFFFFF",
        palette_dirty_white: "#F7F7F7",
        palette_black: "#000000",
        palette_error: "#f44336",
        palette_warning: "#ffa726",
        palette_info: "#29b6f6",
        palette_success: "#66bb6a",
        palette_timeline_green: "#14B8A6",
      },
      height: {
        "screen-3/4": "75vh",
      },
      width: {
        "1/20": "5%",
        "1/10": "10%",
        "3/10": "30%",
        "1/8": "12.5%",
      },
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
