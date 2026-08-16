import type { Component } from 'svelte';
import { content, markdownGlob } from 'acrolls/content';
import { defineDocsConfig } from 'acrolls/docs/content';

type DocsArticle = Component;

export const docs = content({
	loader: markdownGlob<DocsArticle>({
		body: import.meta.glob('../../docs/**/*.md', { import: 'default' }) as Record<
			string,
			() => Promise<DocsArticle>
		>,
		modules: import.meta.glob('../../docs/**/*.md', { eager: true }),
		root: '../../docs'
	}),
	config: defineDocsConfig({
		title: 'Documentation',
		baseHref: '/docs',
		subtitle: 'Generated from Markdown'
	})
}).sourceSync();
