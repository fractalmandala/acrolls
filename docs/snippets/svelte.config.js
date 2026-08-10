import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { createAcrollsMdsvexOptions } from '@acrolls/mdsvex';

const acrolls = createAcrollsMdsvexOptions({
	extensions: ['.md', '.svx']
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.svx'],
	preprocess: [vitePreprocess(), mdsvex(acrolls)],
	kit: {
		adapter: adapter()
	}
};

export default config;
