/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {

    },
  },
  plugins: [

    // require('@tailwindcss/line-clamp')
  ],
};
