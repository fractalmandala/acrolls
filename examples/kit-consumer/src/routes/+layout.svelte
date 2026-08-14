<script lang="ts">
	import type { Snippet } from 'svelte';
	import '$lib/styles/index.sass'
	let { children }: { children: Snippet } = $props();
</script>

<div class="appshell">
	<header class="appheader row xbetween">
		<div class="shell__identity">
			<a href="/">Acrolls</a>
		</div>
		<nav>
			<a class="blank text-sm fw500" href="/docs">Docs</a>
		</nav>
	</header>
	<main class="appbody">
		{@render children()}
	</main>
</div>