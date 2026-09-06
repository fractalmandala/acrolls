import { readFileSync, writeFileSync } from 'node:fs';

const path = '/Users/amrit/fractalmandala/fractalsvelte/vite.config.ts';
let config = readFileSync(path, 'utf8');
const before = config;
config = config.replace(
	"/\\\\.md$|\\\\.svx$/.test(filename)",
	"filename.endsWith('.md') || filename.endsWith('.svx')"
);
if (config === before) throw new Error('broken regex line not found');
writeFileSync(path, config);
console.log('runes predicate fixed');
