<script lang="ts">
	import type { Component } from 'svelte';
	import { docs } from './source';
	import { Publication } from 'acrolls/svelte';

	let { slug, Article }: { slug: string; Article?: Component } = $props();
	const document = $derived(docs.get(slug));
</script>

{#if document}
	<Publication>
		{#if Article}<Article />{/if}
	</Publication>
{:else}
	<p>Documentation page not found.</p>
{/if}
