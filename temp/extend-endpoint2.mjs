import { writeFileSync } from 'node:fs';

writeFileSync(
	'/Users/amrit/fractalmandala/fractalsvelte/src/routes/docs/fractalagentic-data.json/+server.ts',
	[
		"import { json } from '@sveltejs/kit';",
		"import { fractalAgentic } from '$lib/docs/fractalagentic';",
		'',
		'// Temporary inspection endpoint for the fractal-agentic docs wiring:',
		'// GET /docs/fractalagentic-data.json returns the full nav tree plus every',
		'// compiled document (slug, title, headings, href). Delete once the real',
		'// pages under /docs/fractalagentic consume $lib/docs/fractalagentic directly.',
		'export function GET() {',
		'\treturn json({',
		'\t\tnav: fractalAgentic.nav,',
		'\t\tdocuments: fractalAgentic.documents.map((document) => ({',
		'\t\t\tslug: document.slug,',
		'\t\t\ttitle: document.title,',
		'\t\t\tdescription: document.description,',
		'\t\t\thref: document.href,',
		'\t\t\theadings: document.metadata.headings ?? []',
		'\t\t})),',
		'\t\tdiagnostics: fractalAgentic.diagnostics',
		'\t});',
		'}',
		''
	].join('\n')
);
console.log('endpoint reverted to simple version');
