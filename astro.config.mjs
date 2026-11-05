import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import sitemap from "@astrojs/sitemap";
import { remarkMcpInstall } from './src/plugins/remark-mcp-install.mjs';

export default defineConfig({
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [remarkMcpInstall],
  },
  integrations: [
    // Enable Preact to support Preact JSX components.
    preact(),
    // Enable React for the Algolia search component.
    react(),
    // Sitemap
    sitemap(),
  ],
  site: `https://docs.kubeshark.com`
});
