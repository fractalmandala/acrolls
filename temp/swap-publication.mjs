import { readFileSync, writeFileSync } from 'node:fs';

// 1) suppress the engine's injected banner layout — the host composes its own header
const vitePath = '/Users/amrit/fractalmandala/fractalsvelte/vite.config.ts';
let vite = readFileSync(vitePath, 'utf8');
const viteBefore = vite;
vite = vite.replace(
	'createAcrollsSvelteKitMdsvexPreprocessor()',
	'// layout: false — the host composes its own article header; engine banner is suppressed\n\t\t\t\tcreateAcrollsSvelteKitMdsvexPreprocessor({ layout: false })'
);
if (vite === viteBefore) throw new Error('vite.config anchor not found');
writeFileSync(vitePath, vite);

// 2) wrap the compiled article in Publication (client enhancers hook here)
const pagePath =
	'/Users/amrit/fractalmandala/fractalsvelte/src/routes/docs/fractalagentic/[...doc]/+page.svelte';
let page = readFileSync(pagePath, 'utf8');
const pageBefore = page;
page = page
	.replace(
		"\timport { page } from '$app/state';",
		"\timport { page } from '$app/state';\n\timport { Publication } from 'acrolls/svelte';"
	)
	.replace(
		'\t\t\t<div class="prose wfull">\n\t\t\t\t<data.Article />\n\t\t\t</div>',
		'\t\t\t<div class="prose wfull">\n\t\t\t\t<Publication>\n\t\t\t\t\t<data.Article />\n\t\t\t\t</Publication>\n\t\t\t</div>'
	);
if (page === pageBefore) throw new Error('page anchors not found');
writeFileSync(pagePath, page);

console.log('patched: layout:false + Publication wrapper');
