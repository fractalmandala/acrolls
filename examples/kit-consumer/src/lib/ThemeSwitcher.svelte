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
