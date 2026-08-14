import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { createAcrollsSvelteKitMdsvexPreprocessor } from 'acrolls/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx', '.md'],
      preprocess: [
        vitePreprocess(),
        createAcrollsSvelteKitMdsvexPreprocessor()
      ],
      adapter: adapter()
    })
  ]
});
