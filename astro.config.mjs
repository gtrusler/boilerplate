import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import search from '@astrojs/search'

export default defineConfig({
  integrations: [
    mdx(),
    react(),
    tailwind(),
    search(),
  ],
  site: 'https://your-domain.com',
  base: '/docs',
  outDir: './dist/docs',
}) 