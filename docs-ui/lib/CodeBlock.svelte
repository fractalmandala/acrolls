<script lang="ts">
  import "../styles/docs-prose.css";
  import type { Snippet } from "svelte";

  interface Props {
    language?: string;
    title?: string;
    lineNumbers?: boolean;
    children?: Snippet;
  }

  let { language = "", title = "", lineNumbers = false, children }: Props = $props();

  let copied = $state(false);
  const cid = Math.random().toString(36).slice(2);

  async function copy(event: MouseEvent) {
    const pre = (event.currentTarget as HTMLElement).closest("pre");
    const text = pre?.querySelector("code")?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch {}
  }
</script>

<pre
  class="astro-code astro-code-themes github-light github-dark group relative"
  data-language={language}
  data-title={title || undefined}
  data-line-numbers={lineNumbers ? "true" : undefined}
  data-code-id={cid}
>
  <code tabindex="0">
    {@render children?.()}
  </code>
  <button type="button" class="docs-copy-btn" data-blume-copy="" aria-label="Copy code" onclick={copy}>
    {#if copied}
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
    {/if}
  </button>
</pre>
