/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // Scoped, not global: dark: variants only take effect inside an ancestor
  // carrying the "dark" class, which only the Map page's plot panel ever
  // applies (a local per-viewer toggle, not a site-wide theme).
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // A plain, neutral white/grey scale (every surface, border and text
        // colour in the app is one of these tokens) - kept under the
        // "wheat" name so the whole site re-themes just by editing these
        // ten values, with no per-component class changes needed. A single
        // green accent (Tailwind's built-in green-*) is used separately for
        // primary actions/links so the UI isn't flat monochrome.
        // Neutral scale and accent are CSS variables (see src/styles.css); switching
        // [data-theme] on <html> re-themes every component without touching classes.
        wheat: {
          50: 'rgb(var(--n-50) / <alpha-value>)',
          100: 'rgb(var(--n-100) / <alpha-value>)',
          200: 'rgb(var(--n-200) / <alpha-value>)',
          300: 'rgb(var(--n-300) / <alpha-value>)',
          400: 'rgb(var(--n-400) / <alpha-value>)',
          500: 'rgb(var(--n-500) / <alpha-value>)',
          600: 'rgb(var(--n-600) / <alpha-value>)',
          700: 'rgb(var(--n-700) / <alpha-value>)',
          800: 'rgb(var(--n-800) / <alpha-value>)',
          900: 'rgb(var(--n-900) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          strong: 'rgb(var(--accent-strong) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
        },
        page: 'rgb(var(--page) / <alpha-value>)',
        // Dark surfaces for the plotting-area dark mode only.
        ink: {
          700: '#3c3227',
          800: '#251e16',
          900: '#17120c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
}
