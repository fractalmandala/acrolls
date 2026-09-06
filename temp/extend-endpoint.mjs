import { readFileSync, writeFileSync } from 'node:fs';

const path = '/Users/amrit/fractalmandala/fractalsvelte/src/routes/docs/fractalagentic-data.json/+server.ts';
let source = readFileSync(path, 'utf8');
const before = source;
source = source.replace(
	/\texport function GET\(\) \{\n\t\treturn json\(\{/,
	[
		'\texport async function GET() {',
		'\t\t// Import the riskiest document bodies: compile errors surface at import time.',
		'\t\tconst risky = [',
		"\t\t\t'scheduled-essays',",
		"\t\t\t'self-improvement',",
		"\t\t\t'svelte-framework/how-to/use-dom-integrations',",
		"\t\t\t'troubleshooting',",
		'\t\t\t"bosses/creator/INDEX"',
		'\t\t];',
		'\t\tconst bodyChecks: Record<string, boolean> = {};',
		'\t\tfor (const slug of risky) {',
		'\t\t\tconst document = fractalAgentic.documents.find((entry) => entry.slug === slug);',
		'\t\t\ttry {',
		'\t\t\t\tif (document) await document.loader();',
		'\t\t\t\tbodyChecks[slug] = Boolean(document);',
		'\t\t\t} catch {',
		'\t\t\t\tbodyChecks[slug] = false;',
		'\t\t\t}',
		'\t\t}',
		'\t\treturn json({'
	].join('\n')
);
source = source.replace(
	/\t\t\tdiagnostics: fractalAgentic\.diagnostics\n\t\}\);\n\t\}/,
	[
		'\t\t\tdiagnostics: fractalAgentic.diagnostics,',
		'\t\t\tbodyChecks',
		'\t\t});',
		'\t}'
	].join('\n')
);
if (source === before) throw new Error('endpoint anchors not matched');
writeFileSync(path, source);
console.log('endpoint extended with body checks');
