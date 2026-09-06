import { writeFileSync } from 'node:fs';

const target = '/Users/amrit/fractalmandala/fractalsvelte/src/lib/docs/fractalagentic.ts';
writeFileSync(
	target,
	[
		"import type { Component } from 'svelte';",
		"import { createAcrollsDocsSource, defineDocsConfig, type DocsMetadata } from 'acrolls/sveltekit';",
		'',
		'type FractalAgenticDoc = Component;',
		'',
		'/**',
		' * fractal-agentic handbook, compiled by acrolls.',
		' * Source corpus: src/docs/fractalagentic (copied from fractal-agentic/docs)',
		' */',
		'export const fractalAgentic = createAcrollsDocsSource<FractalAgenticDoc>({',
		"	modules: import.meta.glob('../../docs/fractalagentic/**/*.md', {",
		"		import: 'default'",
		'	}),',
		"	metadata: import.meta.glob('../../docs/fractalagentic/**/*.md', {",
		"		eager: true,",
		"		import: 'metadata'",
		'	}) as Record<string, DocsMetadata>,',
		"	contentRoot: '../../docs/fractalagentic',",
		'	config: defineDocsConfig({',
		"		title: 'Fractal Agentic',",
		'		// Nav hrefs and lookups resolve under /docs/fractalagentic',
		'		// (page shell lives at src/routes/docs/fractalagentic)',
		"		baseHref: '/docs/fractalagentic'",
		'	})',
		'});',
		''
	].join('\n')
);
console.log('rewrote', target);
