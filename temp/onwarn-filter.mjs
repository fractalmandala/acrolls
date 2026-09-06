import { readFileSync, writeFileSync } from 'node:fs';

const path = '/Users/amrit/fractalmandala/fractalsvelte/vite.config.ts';
let config = readFileSync(path, 'utf8');
const before = config;
config = config.replace(
	[
		'\t\t\t\t// Force runes mode for the project, except for libraries and mdsvex-compiled',
		'\t\t\t\t// documents (the generated layout wrapper uses legacy $$props). Can be removed in svelte 6.',
		"\t\t\t\trunes: ({ filename }) =>",
		"\t\t\t\t\tfilename.split(/[/\\\\]/).includes('node_modules') || filename.endsWith('.md') || filename.endsWith('.svx')",
		'\t\t\t\t\t\t? undefined',
		'\t\t\t\t\t\t: true'
	].join('\n'),
	[
		'\t\t\t\t// Force runes mode for the project, except for libraries and mdsvex-compiled',
		'\t\t\t\t// documents (the generated layout wrapper uses legacy $$props). Can be removed in svelte 6.',
		"\t\t\t\trunes: ({ filename }) =>",
		"\t\t\t\t\tfilename.split(/[/\\\\]/).includes('node_modules') || filename.endsWith('.md') || filename.endsWith('.svx')",
		'\t\t\t\t\t\t? undefined',
		'\t\t\t\t\t\t: true,',
		'\t\t\t\t// The engine wraps doc tables in role="region" tabindex="0" scroll regions (a11y-valid),',
		'\t\t\t\t// but Svelte\u2019s noninteractive-tabindex rule has no region allowlist. Quiet it for',
		'\t\t\t\t// compiled docs only \u2014 app code keeps full a11y warnings.',
		'\t\t\t\tonwarn: (warning, handler) => {',
		"\t\t\t\t\tif (warning.code === 'a11y_no_noninteractive_tabindex' && warning.filename?.endsWith('.md')) return;",
		'\t\t\t\t\thandler(warning);',
		'\t\t\t\t}'
	].join('\n')
);
if (config === before) throw new Error('compilerOptions anchor not found');
writeFileSync(path, config);
console.log('onwarn filter added');
