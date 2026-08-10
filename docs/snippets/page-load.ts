/**
 * Copy to src/routes/docs/[slug]/+page.ts
 * Adjust the glob to match where you keep markdown files.
 */
import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import type { PageLoad } from './$types';

// Example: guides live in src/routes/docs/guides/*.md
const modules = import.meta.glob('../guides/*.md');

export const load: PageLoad = async ({ params }) => {
	const key = `../guides/${params.slug}.md`;
	const loader = modules[key];
	if (!loader) error(404, `Guide "${params.slug}" not found`);

	const mod = (await loader()) as {
		default: Component;
		metadata?: Record<string, string>;
	};

	return {
		document: mod.default,
		metadata: mod.metadata ?? {}
	};
};
