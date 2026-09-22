import { cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = dirname(fileURLToPath(import.meta.url));

const staticEntries = [
  'index.html',
  'index-tr.html',
  'index-de.html',
  '404.html',
  'css',
  'js',
  'images',
  'fonts',
  'documents',
  'CNAME',
  'robots.txt',
  'sitemap.xml'
];

function copyPortfolioAssets() {
  return {
    name: 'copy-portfolio-assets',
    apply: 'build',
    closeBundle() {
      const output = resolve(root, 'dist');

      mkdirSync(output, { recursive: true });
      staticEntries.forEach((entry) => {
        cpSync(resolve(root, entry), resolve(output, entry), { recursive: true });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), copyPortfolioAssets()],
  publicDir: false,
  build: {
    rollupOptions: {
      input: {
        blog: resolve(root, 'blog.html'),
        blogPost: resolve(root, 'blog-post.html')
      }
    }
  }
});
