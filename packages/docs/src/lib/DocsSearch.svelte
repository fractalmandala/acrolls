<script lang="ts">
	// Full-text search over the Pagefind index. Acrolls takes no pagefind
	// dependency — this loads the runtime that the host's post-build `pagefind`
	// step emits into the served output (default `/pagefind/pagefind.js`). When the
	// index is absent (e.g. `vite dev` before a build), the box degrades to a note.

	type PagefindResult = { id: string; data: () => Promise<PagefindDocument> };
	type PagefindDocument = {
		url: string;
		excerpt: string;
		meta?: { title?: string } & Record<string, string>;
	};
	type PagefindApi = {
		init?: () => Promise<void>;
		search: (query: string) => Promise<{ results: PagefindResult[] }>;
	};

	type Props = {
		/** URL of the Pagefind runtime emitted by the post-build step. */
		bundlePath?: string;
		placeholder?: string;
		maxResults?: number;
		label?: string;
	};

	let {
		bundlePath = '/pagefind/pagefind.js',
		placeholder = 'Search docs…',
		maxResults = 8,
		label = 'Search documentation'
	}: Props = $props();

	let query = $state('');
	let results = $state<PagefindDocument[]>([]);
	let status = $state<'idle' | 'loading' | 'ready' | 'searching' | 'unavailable'>('idle');
	let pagefind: PagefindApi | null = null;
	let token = 0;

	async function ensureLoaded(): Promise<PagefindApi | null> {
		if (pagefind) return pagefind;
		status = 'loading';
		try {
			const mod = (await import(/* @vite-ignore */ bundlePath)) as PagefindApi;
			await mod.init?.();
			pagefind = mod;
			status = 'ready';
			return mod;
		} catch {
			status = 'unavailable';
			return null;
		}
	}

	let debounce: ReturnType<typeof setTimeout> | undefined;
	function onInput() {
		clearTimeout(debounce);
		const current = query.trim();
		if (!current) {
			results = [];
			if (status === 'searching') status = 'ready';
			return;
		}
		debounce = setTimeout(() => void run(current), 160);
	}

	async function run(current: string) {
		const api = await ensureLoaded();
		if (!api) return;
		const mine = ++token;
		status = 'searching';
		const search = await api.search(current);
		if (mine !== token) return; // a newer query superseded this one
		const docs = await Promise.all(search.results.slice(0, maxResults).map((r) => r.data()));
		if (mine !== token) return;
		results = docs;
		status = 'ready';
	}
</script>

<div class="acrolls-docs-search" data-status={status}>
	<input
		class="acrolls-docs-search__input"
		type="search"
		aria-label={label}
		{placeholder}
		bind:value={query}
		oninput={onInput}
		onfocus={ensureLoaded}
	/>

	{#if status === 'unavailable'}
		<p class="acrolls-docs-search__note">Search index not built yet. Run the production build.</p>
	{:else if query.trim() && results.length === 0 && status === 'ready'}
		<p class="acrolls-docs-search__note">No results for “{query.trim()}”.</p>
	{:else if results.length}
		<ul class="acrolls-docs-search__results">
			{#each results as result}
				<li class="acrolls-docs-search__result">
					<a href={result.url}>
						<span class="acrolls-docs-search__result-title">{result.meta?.title ?? result.url}</span>
						<!-- Pagefind returns an HTML excerpt with <mark> highlights -->
						<span class="acrolls-docs-search__result-excerpt">{@html result.excerpt}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
