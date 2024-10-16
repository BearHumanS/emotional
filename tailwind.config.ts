import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      minHeight: {
        'screen-minus-40': 'calc(100vh - 40px)',
      },
      fontVariationSettings: {
        normal: "'wght' 100, 'wdth' 85",
        'bold-wide': "'wght' 700, 'wdth' 200",
      },
      dropShadow: {
        custom: '0px 0px 12px #334155',
      },
    },
  },
  plugins: [],
};
export default config;
