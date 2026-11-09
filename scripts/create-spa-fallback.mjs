import { copyFile, mkdir } from 'node:fs/promises'

const index = new URL('../dist/index.html', import.meta.url)
await copyFile(index, new URL('../dist/404.html', import.meta.url))

for (const route of ['projects/taskforge', 'projects/flagbit']) {
  const directory = new URL(`../dist/${route}/`, import.meta.url)
  await mkdir(directory, { recursive: true })
  await copyFile(index, new URL('index.html', directory))
}

console.log('Created static route entries and dist/404.html for GitHub Pages.')
