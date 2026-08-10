import { describe, expect, it } from 'vitest';
import {
	buildDocsCrumbs,
	docsPager,
	findActiveDocsItem,
	flattenDocsNav,
	nodeContainsPath,
	withNavIds
} from './nav.js';
import type { DocsNav } from './types.js';

const sample: DocsNav = {
	title: 'Developer',
	baseHref: '/docs/developer',
	storageKey: 'dev',
	sections: [
		{
			id: 'core',
			title: 'Core',
			defaultOpen: true,
			items: [
				{ title: 'Architecture', href: '/docs/developer/architecture' },
				{
					title: 'Data',
					children: [
						{ title: 'Pipeline', href: '/docs/developer/corpus-pipeline' },
						{ title: 'Artifacts', href: '/docs/developer/artifact-contracts' }
					]
				}
			]
		},
		{
			id: 'ui',
			title: 'UI',
			items: [{ title: 'Reader', href: '/docs/developer/reader-and-lens' }]
		}
	]
};

describe('nested nav', () => {
	it('flattens leaves depth-first', () => {
		const leaves = flattenDocsNav(withNavIds(sample));
		expect(leaves.map((l) => l.title)).toEqual([
			'Architecture',
			'Pipeline',
			'Artifacts',
			'Reader'
		]);
	});

	it('finds nested active item', () => {
		const active = findActiveDocsItem(sample, '/docs/developer/artifact-contracts');
		expect(active?.title).toBe('Artifacts');
	});

	it('nodeContainsPath walks children', () => {
		const data = sample.sections[0]!.items[1]!;
		expect(nodeContainsPath(data, '/docs/developer/corpus-pipeline')).toBe(true);
		expect(nodeContainsPath(data, '/docs/developer/architecture')).toBe(false);
	});

	it('pager crosses nested boundaries', () => {
		const { previous, next } = docsPager(sample, '/docs/developer/corpus-pipeline');
		expect(previous?.title).toBe('Architecture');
		expect(next?.title).toBe('Artifacts');
	});

	it('crumbs include section and nested groups', () => {
		const crumbs = buildDocsCrumbs(sample, '/docs/developer/artifact-contracts', {
			homeLabel: 'App'
		});
		expect(crumbs.map((c) => c.label)).toEqual([
			'App',
			'Developer',
			'Core',
			'Data',
			'Artifacts'
		]);
	});
});
