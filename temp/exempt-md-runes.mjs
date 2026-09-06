import { readFileSync, writeFileSync } from 'node:fs';

const path = '/Users/amrit/fractalmandala/fractalsvelte/vite.config.ts';
let config = readFileSync(path, 'utf8');
const before = config;
config = config.replace(
	[
		'\t\t\tcompilerOptions: {',
		'\t\t\t\t// Force runes mode for the project, except for libraries. Can be removed in svelte 6.',
		'\t\t\t\trunes: ({ filename }) =>',
		"\t\t\t\t\tfilename.split(/[/\\\\]/).includes('node_modules') ? undefined : true",
		'\t\t\t},'
	].join('\n'),
	[
		'\t\t\tcompilerOptions: {',
		'\t\t\t\t// Force runes mode for the project, except for libraries and mdsvex-compiled',
		'\t\t\t\t// documents (the generated layout wrapper uses legacy $$props). Can be removed in svelte 6.',
		'\t\t\t\trunes: ({ filename }) =>',
		"\t\t\t\t\tfilename.split(/[/\\\\]/).includes('node_modules') || /\\\\.md$|\\\\.svx$/.test(filename)",
		'\t\t\t\t\t\t? undefined',
		'\t\t\t\t\t\t: true',
		'\t\t\t},'
	].join('\n')
);
if (config === before) throw new Error('compilerOptions block not matched');
writeFileSync(path, config);
console.log('runes exemption added');
