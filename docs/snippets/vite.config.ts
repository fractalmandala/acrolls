import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { createAcrollsMdsvexPreprocessor } from 'acrolls/mdsvex';
import { defineConfig } from 'vite';

const acrolls = createAcrollsMdsvexPreprocessor({
	extensions: ['.md', '.svx']
});

export default defineConfig({
	plugins: [
		sveltekit({
			extensions: ['.svelte', '.md', '.svx'],
			preprocess: [vitePreprocess(), acrolls],
			adapter: adapter()
		})
	]
});
