<script lang="ts">
	import type { DocsNav } from './types.js';
	import DocsAccordion from './DocsAccordion.svelte';
	import { sectionShouldOpen } from './nav.js';

	type Props = {
		nav: DocsNav;
		pathname: string;
		/** Optional search filter (client) */
		filterable?: boolean;
		class?: string;
	};

	let { nav, pathname, filterable = false, class: className = '' }: Props = $props();

	let query = $state('');
	let openOverrides = $state<Record<string, boolean>>({});

	const q = $derived(query.trim().toLowerCase());

	const visibleSections = $derived.by(() => {
		return nav.sections
			.map((section) => {
				if (!q) return section;
				const items = section.items.filter(
					(i) =>
						i.title.toLowerCase().includes(q) ||
						(i.description?.toLowerCase().includes(q) ?? false)
				);
				if (!items.length && !section.title.toLowerCase().includes(q)) return null;
				return { ...section, items: items.length ? items : section.items };
			})
			.filter((s): s is (typeof nav.sections)[number] => s != null);
	});

	function onToggle(id: string, open: boolean) {
		openOverrides = { ...openOverrides, [id]: open };
	}

	function openFor(section: (typeof nav.sections)[number]): boolean {
		if (q) return true;
		if (openOverrides[section.id] !== undefined) return openOverrides[section.id]!;
		return sectionShouldOpen(section, pathname);
	}
</script>

<aside class={['acrolls-docs-sidebar', className].filter(Boolean).join(' ')} aria-label="Documentation">
	<div class="acrolls-docs-sidebar__brand">
		<a class="acrolls-docs-sidebar__title" href={nav.baseHref}>{nav.title}</a>
		{#if nav.subtitle}
			<p class="acrolls-docs-sidebar__subtitle">{nav.subtitle}</p>
		{/if}
	</div>

	{#if filterable}
		<label class="acrolls-docs-sidebar__filter">
			<span class="visually-hidden">Filter navigation</span>
			<input type="search" placeholder="Filter pages…" bind:value={query} autocomplete="off" />
		</label>
	{/if}

	<nav class="acrolls-docs-sidebar__nav" aria-label="{nav.title} sections">
		{#each visibleSections as section (section.id)}
			<DocsAccordion {section} {pathname} open={openFor(section)} {onToggle} />
		{:else}
			<p class="acrolls-docs-sidebar__empty">No matching pages.</p>
		{/each}
	</nav>
</aside>
