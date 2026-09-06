<script lang="ts">
  import "../styles/docs-prose.css";
  import type { Snippet } from "svelte";

  interface Props {
    /** Original: data-blume-callout="note" | "tip" */
    type?: "note" | "tip";
    children?: Snippet;
  }

  let { type = "note", children }: Props = $props();
</script>

<aside class="not-prose" data-blume-callout={type}>
  <span class="docs-callout-icon">
    {#if type === "tip"}
      <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5m0 4h6m-5 4h4" />
      </svg>
    {:else}
      <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4m0-4h.01" />
        </g>
      </svg>
    {/if}
  </span>
  <div class="docs-callout-body">
    {@render children?.()}
  </div>
</aside>
