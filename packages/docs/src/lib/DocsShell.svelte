<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { DocsCrumb, DocsNav, DocsPagerLink } from './types.js';
	import { buildDocsCrumbs, docsPager } from './nav.js';
	import DocsSidebar from './DocsSidebar.svelte';
	import DocsBreadcrumbs from './DocsBreadcrumbs.svelte';
	import DocsPager from './DocsPager.svelte';

	type Props = {
		nav: DocsNav;
		pathname: string;
		/** Override crumbs; default built from nav + pathname */
		crumbs?: DocsCrumb[];
		homeHref?: string;
		homeLabel?: string;
		filterable?: boolean;
		/** Show prev/next footer */
		showPager?: boolean;
		/** Optional mobile menu label */
		menuLabel?: string;
		/** Main article / page body */
		children: Snippet;
		/** Optional slot above content (banners, alerts) */
		header?: Snippet;
	};

	let {
		nav,
		pathname,
		crumbs,
		homeHref = '/',
		homeLabel = 'Home',
		filterable = true,
		showPager = true,
		menuLabel = 'Docs menu',
		children,
		header
	}: Props = $props();

	const resolvedCrumbs = $derived(
		crumbs ?? buildDocsCrumbs(nav, pathname, { homeHref, homeLabel })
	);
	const pager = $derived(docsPager(nav, pathname));
	const previous = $derived(pager.previous as DocsPagerLink);
	const next = $derived(pager.next as DocsPagerLink);

	let mobileOpen = $state(false);

	// close mobile drawer on navigation
	$effect(() => {
		pathname;
		mobileOpen = false;
	});
</script>

<div class="acrolls-docs-shell" class:is-mobile-nav-open={mobileOpen}>
	<button
		type="button"
		class="acrolls-docs-shell__menu-btn"
		aria-expanded={mobileOpen}
		aria-controls="acrolls-docs-sidebar"
		onclick={() => (mobileOpen = !mobileOpen)}
	>
		{mobileOpen ? 'Close menu' : menuLabel}
	</button>

	{#if mobileOpen}
		<button
			type="button"
			class="acrolls-docs-shell__backdrop"
			aria-label="Close documentation menu"
			onclick={() => (mobileOpen = false)}
		></button>
	{/if}

	<div class="acrolls-docs-shell__sidebar" id="acrolls-docs-sidebar">
		<DocsSidebar {nav} {pathname} {filterable} />
	</div>

	<div class="acrolls-docs-shell__main">
		<header class="acrolls-docs-shell__top">
			<DocsBreadcrumbs crumbs={resolvedCrumbs} />
			{#if header}
				<div class="acrolls-docs-shell__header-extra">
					{@render header()}
				</div>
			{/if}
		</header>

		<div class="acrolls-docs-shell__content">
			{@render children()}
		</div>

		{#if showPager && (previous || next)}
			<footer class="acrolls-docs-shell__footer">
				<DocsPager {previous} {next} />
			</footer>
		{/if}
	</div>
</div>
