import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = '/Users/amrit/fractalmandala/fractal-agentic/docs';
const walk = (d) =>
	readdirSync(d, { withFileTypes: true }).flatMap((e) =>
		e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]
	);

let flagged = 0;
for (const file of walk(root).filter((f) => f.endsWith('.md'))) {
	const rel = file.slice(root.length + 1);
	const lines = readFileSync(file, 'utf8').split('\n');
	let inFence = false;
	const prose = [];
	lines.forEach((line, i) => {
		if (/^\s*`{3,}/.test(line)) {
			inFence = !inFence;
			return;
		}
		if (!inFence && /[{}]/.test(line)) prose.push(`${i + 1}: ${line.trim().slice(0, 90)}`);
	});
	const fm = lines[0] === '---';
	if (prose.length > 0 || !fm) {
		flagged++;
		console.log(`${rel}${fm ? '' : '  [NO FRONTMATTER]'}`);
		for (const p of prose.slice(0, 3)) console.log(`   ${p}`);
		if (prose.length > 3) console.log(`   … +${prose.length - 3} more`);
	}
}
console.log(`\nscanned: flagged ${flagged}`);
