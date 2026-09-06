import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = '/Users/amrit/fractalmandala/fractalsvelte';

// 1) vite.config.ts — swap vanilla mdsvex for the acrolls preprocessor
const viteConfigPath = `${root}/vite.config.ts`;
let viteConfig = readFileSync(viteConfigPath, 'utf8');
const before = viteConfig;
viteConfig = viteConfig
	.replace("import { mdsvex } from 'mdsvex';\n", '')
	.replace(
		"import { defineConfig } from 'vite';",
		"import { defineConfig } from 'vite';\nimport { createAcrollsSvelteKitMdsvexPreprocessor } from 'acrolls/sveltekit';"
	)
	.replace(
		"\t\t\tpreprocess: [mdsvex({ extensions: ['.svx', '.md'] })],",
		[
			'\t\t\tpreprocess: [',
			"\t\t\t\t// acrolls pipeline for compiled docs (metadata export, heading facts, Shiki)",
			'\t\t\t\tcreateAcrollsSvelteKitMdsvexPreprocessor()',
			'\t\t\t],'
		].join('\n')
	);
if (viteConfig === before) throw new Error('vite.config.ts did not change — originals not found');
writeFileSync(viteConfigPath, viteConfig);

// 2) content source module
mkdirSync(`${root}/src/lib/docs`, { recursive: true });
writeFileSync(
	`${root}/src/lib/docs/fractalagentic.ts`,
	[
		"import type { Component } from 'svelte';",
		"import { content, markdownGlob } from 'acrolls/content';",
		"import { defineDocsConfig } from 'acrolls/docs/content';",
		'',
		'type FractalAgenticDoc = Component;',
		'',
		'/**',
		' * fractal-agentic handbook, compiled by acrolls.',
		' * Source corpus: src/docs/fractalagentic (copied from fractal-agentic/docs)',
		' */',
		'export const fractalAgentic = content({',
		'	loader: markdownGlob<FractalAgenticDoc>({',
		"		body: import.meta.glob('../../docs/fractalagentic/**/*.md', {",
			"			import: 'default'",
		"		}) as Record<string, () => Promise<FractalAgenticDoc>>,",
		"		metadata: import.meta.glob('../../docs/fractalagentic/**/*.md', {",
		"			eager: true,",
		"			import: 'metadata'",
		'		}),',
		"		facts: import.meta.glob('../../docs/fractalagentic/**/*.md', {",
		"			eager: true,",
		"			import: '__acrollsDocument'",
		'		}),',
		"		root: '../../docs/fractalagentic'",
		'	}),',
		'	config: defineDocsConfig({',
		"		title: 'Fractal Agentic',",
		'		// Nav hrefs and lookups resolve under /docs/fractalagentic',
		'		// (page shell lives at src/routes/docs/fractalagentic)',
		"		baseHref: '/docs/fractalagentic'",
		'	})',
		'}).sourceSync();',
		''
	].join('\n')
);

// 3) temporary inspection endpoint
mkdirSync(`${root}/src/routes/docs/fractalagentic-data.json`, { recursive: true });
writeFileSync(
	`${root}/src/routes/docs/fractalagentic-data.json/+server.ts`,
	[
		"import { json } from '@sveltejs/kit';",
		"import { fractalAgentic } from '$lib/docs/fractalagentic';",
		'',
		'// Temporary inspection endpoint for the fractal-agentic docs wiring:',
		'// GET /docs/fractalagentic-data.json returns the full nav tree plus every',
		'// compiled document (slug, title, headings, href). Delete once the real',
		'// pages under /docs/fractalagentic consume $lib/docs/fractalagentic directly.',
		'export function GET() {',
		'	return json({',
		'		nav: fractalAgentic.nav,',
		'		documents: fractalAgentic.documents.map((document) => ({',
		'			slug: document.slug,',
		'			title: document.title,',
		'			description: document.description,',
		'			href: document.href,',
		'			headings: document.metadata.headings ?? []',
		'		})),',
		'		diagnostics: fractalAgentic.diagnostics',
		'	});',
		'}',
		''
	].join('\n')
);

console.log('patched: vite.config.ts, src/lib/docs/fractalagentic.ts, fractalagentic-data.json/+server.ts');
