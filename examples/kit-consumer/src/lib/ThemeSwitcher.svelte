<script lang="ts">
	import { onMount } from 'svelte';

	const themes = [
		{ id: 'paper', label: 'Paper' },
		{ id: 'midnight', label: 'Midnight' },
		{ id: 'moss', label: 'Moss' }
	] as const;

	type ThemeId = (typeof themes)[number]['id'];

	const storageKey = 'acrolls-demo:theme';
	let activeTheme = $state<ThemeId>('paper');

	function isThemeId(value: string | null): value is ThemeId {
		return themes.some((theme) => theme.id === value);
	}

	function applyTheme(theme: ThemeId) {
		activeTheme = theme;
		document.documentElement.dataset.acrollsTheme = theme;
		localStorage.setItem(storageKey, theme);
	}

	onMount(() => {
		const storedTheme = localStorage.getItem(storageKey);
		applyTheme(isThemeId(storedTheme) ? storedTheme : activeTheme);
	});
</script>

<label class="theme-switcher">
	<span>Theme</span>
	<select
		value={activeTheme}
		onchange={(event) => applyTheme(event.currentTarget.value as ThemeId)}
	>
		{#each themes as theme (theme.id)}
			<option value={theme.id}>{theme.label}</option>
		{/each}
	</select>
</label>

<style>
	.theme-switcher {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		font-size: 0.75rem;
		font-weight: 650;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--muted-foreground);
	}

	.theme-switcher select {
		border: 1px solid var(--border);
		border-radius: calc(var(--radius) * 0.75);
		background: var(--card);
		color: var(--foreground);
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: normal;
		text-transform: none;
		padding: 0.4rem 1.8rem 0.4rem 0.65rem;
		cursor: pointer;
	}

	.theme-switcher select:focus-visible {
		outline: 2px solid color-mix(in oklab, var(--accent) 60%, transparent);
		outline-offset: 2px;
	}
</style>
