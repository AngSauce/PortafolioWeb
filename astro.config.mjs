import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://angsauce.github.io',
  base: '/PortafolioWeb/',
  vite: {
    plugins: [tailwindcss()]
  }
});