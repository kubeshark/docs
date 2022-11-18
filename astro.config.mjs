import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import codeExtra from 'remark-code-extra';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [
  // Enable Preact to support Preact JSX components.
  preact(),
  // Enable React for the Algolia search component.
  react(), sitemap()],
  markdown: {
    remarkPlugins: [[codeExtra, {
      // Add a link to stackoverflow if there is one in the meta
      transform: node => ({
        after: [{
          type: 'element',
          tagName: 'button',
          children: []
        }]
      })
    }]]
  },
  site: `http://astro.build`
});
