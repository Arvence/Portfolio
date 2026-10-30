import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'defer-startup-styles',
      apply: 'build',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          return html.replace(
            '<link rel="stylesheet" crossorigin',
            `<link id="app-styles" rel="stylesheet" crossorigin media="print" fetchpriority="high" onload="this.media = 'all'; this.dataset.state = 'ready'" onerror="this.dataset.state = 'error'; document.dispatchEvent(new Event('portfolio:startup-error'))"`,
          )
        },
      },
    },
  ],
})
