import type { Component } from 'svelte';
import * as v from 'valibot';
import { content, markdownGlob } from 'acrolls/content';
import { defineDocsConfig } from 'acrolls/docs/content';

type DocsArticle = Component;

/**
 * `title` stays `optional` even though this host runs in `authored` mode: the engine's own
 * `ACROLLS_TITLE_REQUIRED` admission rule already enforces titles and derives index titles from
 * folders, so a required-title schema would double-reject index pages.
 */
const frontmatter = v.object({
	title: v.optional(v.string()),
	description: v.optional(v.string()),
	order: v.optional(v.number()),
	hidden: v.optional(v.boolean()),
	draft: v.optional(v.boolean())
});

export const docs = content({
	loader: markdownGlob<DocsArticle>({
		body: import.meta.glob('../../content/**/*.md', { import: 'default' }) as Record<
			string,
			() => Promise<DocsArticle>
		>,
		modules: import.meta.glob('../../content/**/*.md', { eager: true }),
		root: '../../content'
	}),
	schema: frontmatter,
	filter: (entry) => !entry.data.draft,
	config: defineDocsConfig({
		title: 'Example docs',
		baseHref: '/docs',
		convention: {
			mode: 'authored',
			frontmatter: {
				ordinaryPageTitle: 'required',
				indexTitle: 'folder',
				description: 'optional',
				leadingH1: 'suppress-and-warn'
			}
		},
		subtitle: 'Generated from Markdown',
		section: {
			title: 'Reference',
			defaultOpen: true
		},
		folders: {
			guides: {
				title: 'Guides',
				order: 1
			}
		},
		entries: {
			guides: {
				kind: 'group',
				title: 'Guides',
				landing: 'guides/index.md',
				order: 1
			},
			'guides/installation': {
				parent: 'guides',
				title: 'Install',
				href: '/docs/guides/install',
				order: 0
			},
			'guides/advanced/performance': {
				parent: 'guides',
				title: 'Performance',
				order: 2
			}
		}
	})
}).sourceSync();
