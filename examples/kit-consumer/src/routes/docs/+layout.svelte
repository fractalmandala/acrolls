<script lang="ts">
	import { page } from '$app/state';
	import { DocsShell } from 'acrolls/docs';
	import { docs } from '../../lib/docs/source';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	// Derive the index check from the configured base href — never hardcode the route.
	const base = docs.nav.baseHref;
	const isIndex = $derived(page.url.pathname === base || page.url.pathname === `${base}/`);
</script>

<DocsShell nav={docs.nav} pathname={page.url.pathname} showToc={!isIndex} showPager={!isIndex}>
	{@render children()}
</DocsShell>
