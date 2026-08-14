import adapter from '@sveltejs/adapter-auto';
import { fileURLToPath } from 'node:url';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { createAcrollsSvelteKitMdsvexPreprocessor } from 'acrolls/sveltekit';
import { defineConfig } from 'vite';

const docsArticleLayout = fileURLToPath(new URL('./src/lib/docs/DocsArticleLayout.svelte', import.meta.url));

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx', '.md'],
      preprocess: [
        vitePreprocess(),
		createAcrollsSvelteKitMdsvexPreprocessor({
			layout: { _: docsArticleLayout },
			docs: { mode: 'authored' }
		})
      ],
      adapter: adapter()
    })
  ]
});
