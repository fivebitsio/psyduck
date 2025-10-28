/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Include files from both docs and web apps
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
    '../web/src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/fumadocs-ui/dist/**/*.js'
  ],
  presets: [require('./node_modules/fumadocs-ui/dist/preset')]
}
