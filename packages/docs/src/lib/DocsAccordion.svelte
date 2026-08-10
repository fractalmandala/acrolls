<script lang="ts">
	import type { DocsNavItem, DocsNavSection } from './types.js';
	import { normalizePath } from './nav-path.js';

	type Props = {
		section: DocsNavSection;
		pathname: string;
		/** Controlled open state; when undefined, uses defaultOpen + active child */
		open?: boolean;
		onToggle?: (id: string, open: boolean) => void;
	};

	let { section, pathname, open, onToggle }: Props = $props();

	function isActive(item: DocsNavItem): boolean {
		return normalizePath(item.href) === normalizePath(pathname);
	}

	const hasActive = $derived(section.items.some((i) => isActive(i)));
	const isOpen = $derived(open ?? (section.defaultOpen || hasActive));

	function handleToggle(e: Event) {
		const el = e.currentTarget as HTMLDetailsElement;
		onToggle?.(section.id, el.open);
	}
</script>

<details
	class="acrolls-docs-accordion"
	class:is-active-section={hasActive}
	open={isOpen}
	ontoggle={handleToggle}
>
	<summary class="acrolls-docs-accordion__summary">
		<span class="acrolls-docs-accordion__title">{section.title}</span>
		<span class="acrolls-docs-accordion__chevron" aria-hidden="true"></span>
	</summary>
	<ul class="acrolls-docs-accordion__list" role="list">
		{#each section.items as item}
			<li>
				<a
					class="acrolls-docs-accordion__link"
					class:is-active={isActive(item)}
					href={item.href}
					aria-current={isActive(item) ? 'page' : undefined}
				>
					<span class="acrolls-docs-accordion__link-title">{item.title}</span>
					{#if item.badge}
						<span class="acrolls-docs-accordion__badge">{item.badge}</span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</details>
