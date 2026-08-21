import type { Component } from 'svelte';
import { content, markdownGlob } from 'acrolls/content';
import { defineDocsConfig, type DocsDocumentFacts, type DocsMetadata } from 'acrolls/docs/content';

type DocsArticle = Component;

export const docs = content({
	loader: markdownGlob<DocsArticle>({
		body: import.meta.glob('../../docs/**/*.md', { import: 'default' }) as Record<
			string,
			() => Promise<DocsArticle>
		>,
		metadata: import.meta.glob('../../docs/**/*.md', {
			eager: true,
			import: 'metadata'
		}) as Record<string, DocsMetadata>,
		facts: import.meta.glob('../../docs/**/*.md', {
			eager: true,
			import: '__acrollsDocument'
		}) as Record<string, DocsDocumentFacts>,
		root: '../../docs'
	}),
	config: defineDocsConfig({
		title: 'Documentation',
		baseHref: '/docs',
		subtitle: 'Generated from Markdown'
	})
}).sourceSync();
