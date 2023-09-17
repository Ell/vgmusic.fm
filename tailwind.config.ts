import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      visibility: ["group-hover"]
    },
  },
  plugins: [],
} satisfies Config

