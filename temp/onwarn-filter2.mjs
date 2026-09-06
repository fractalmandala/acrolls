import { readFileSync, writeFileSync } from 'node:fs';

const path = '/Users/amrit/fractalmandala/fractalsvelte/vite.config.ts';
let config = readFileSync(path, 'utf8');
const before = config;
config = config.replace(
	'\t\t\t\t\t\t: true\n\t\t\t},',
	[
		'\t\t\t\t\t\t: true',
		'\t\t\t},',
		'\t\t\t// The engine wraps doc tables in role="region" tabindex="0" scroll regions (a11y-valid),',
		"\t\t\t// but Svelte's noninteractive-tabindex rule has no region allowlist. Quiet it for",
		'\t\t\t// compiled docs only - app code keeps full a11y warnings.',
		'\t\t\tvitePlugin: {',
		'\t\t\t\tonwarn: (warning, handler) => {',
		"\t\t\t\t\tif (warning.code === 'a11y_no_noninteractive_tabindex' && (warning.filename?.endsWith('.md') || warning.filename?.endsWith('.svx'))) return;",
		'\t\t\t\t\thandler(warning);',
		'\t\t\t\t}',
		'\t\t\t},'
	].join('\n')
);
if (config === before) throw new Error('anchor not found');
writeFileSync(path, config);
console.log('onwarn filter added');
