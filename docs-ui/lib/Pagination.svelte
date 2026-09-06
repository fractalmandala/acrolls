<script lang="ts">
  import "../styles/docs-ui.css";

  interface PageLink {
    label: string;
    href: string;
  }

  interface Props {
    prev?: PageLink | null;
    next?: PageLink | null;
  }

  let { prev = null, next = null }: Props = $props();
</script>

{#if prev || next}
  <nav aria-label="Pagination" class="docs-pagination">
    {#if prev}
      <a class="docs-page-link" href={prev.href}>
        <svg aria-hidden="true" class="docs-page-arrow" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 19-7-7 7-7m7 7H5" />
        </svg>
        <span class="min-w-0">
          <span class="eyebrow">Previous</span>
          <span class="title">{prev.label}</span>
        </span>
      </a>
    {/if}
    {#if next}
      <a class="docs-page-link docs-page-link--next" href={next.href}>
        <span class="min-w-0">
          <span class="eyebrow">Next</span>
          <span class="title">{next.label}</span>
        </span>
        <svg aria-hidden="true" class="docs-page-arrow" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7 7 7-7 7" />
        </svg>
      </a>
    {/if}
  </nav>
{/if}
