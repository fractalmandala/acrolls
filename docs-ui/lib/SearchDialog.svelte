<script lang="ts">
  import "../styles/docs-search.css";
  import type { Snippet } from "svelte";

  interface PopularItem {
    label: string;
    route: string;
  }

  interface Props {
    locale?: string;
    placeholder?: string;
    popular?: PopularItem[];
    showAllLanguages?: boolean;
    results?: Snippet;
    preview?: Snippet;
  }

  let {
    locale = "en",
    placeholder = "Search documentation…",
    popular = [
      { label: "blume@1.6.3", route: "/changelog/blume-1-6-3" },
      { label: "blume@1.6.2", route: "/changelog/blume-1-6-2" },
      { label: "blume@1.6.1", route: "/changelog/blume-1-6-1" }
    ],
    showAllLanguages = false,
    results,
    preview
  }: Props = $props();

  let dialog: HTMLDialogElement | null = $state(null);
  let query = $state("");
  let allLocales = $state(showAllLanguages);

  function open() {
    dialog?.showModal();
    // Focus input after open
    requestAnimationFrame(() => dialog?.querySelector("input")?.focus());
  }

  function closeIfBackdrop(event: MouseEvent) {
    if (event.target === dialog) dialog?.close();
  }

  function onKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<!--
  NOTE: <blume-search> / <dialog> are custom-element / native-dialog islands
  from the original Astro theme. This Svelte port keeps the exact
  data-blume-* hooks so existing Search.js behaviour can attach,
  while adding a minimal Svelte open/close controller.
-->
<blume-search
  class="contents"
  data-locale={locale}
  data-i18n-all="All"
  data-i18n-ask="Ask AI"
  data-i18n-ask-hint="Get an instant answer from AI"
  data-i18n-dev="Search is available in the production build."
  data-i18n-empty="No results found."
  data-i18n-error="Something went wrong. Please try again."
  data-i18n-popular="Popular"
  data-i18n-results="Results"
>
  <button aria-label="Search" class="docs-search-trigger" data-blume-search-open="" type="button" onclick={open}>
    <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="m21 21-4.34-4.34" />
        <circle cx="11" cy="11" r="8" />
      </g>
    </svg>
    <span class="grow">Search</span>
    <kbd data-blume-search-kbd="">⌘K</kbd>
  </button>

  <dialog
    aria-label="Search docs"
    data-blume-search-dialog=""
    bind:this={dialog}
    onclick={closeIfBackdrop}
  >
    <div class="docs-search-bar">
      <svg aria-hidden="true" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </g>
      </svg>
      <input
        aria-autocomplete="list"
        aria-controls="blume-search-listbox"
        aria-expanded="false"
        aria-label="Search docs"
        autocomplete="off"
        role="combobox"
        type="search"
        data-blume-search-input=""
        {placeholder}
        bind:value={query}
      />
      <kbd class="docs-kbd">Esc</kbd>
    </div>

    <div class="docs-search-grid" data-blume-search-grid="">
      <div class="docs-search-left">
        <div data-blume-search-filters="" hidden></div>
        <div
          id="blume-search-listbox"
          role="listbox"
          aria-label="Search docs"
          data-blume-search-results=""
        >
          {@render results?.()}
        </div>
        <p data-blume-search-message="" hidden></p>
      </div>
      <div data-blume-search-preview="" class="docs-search-preview">
        {@render preview?.()}
      </div>
    </div>

    <div class="docs-search-footer">
      <span class="hints">
        <label class="docs-check">
          <input type="checkbox" data-blume-search-all-locales="" bind:checked={allLocales} />
          All languages
        </label>
      </span>
      <div class="hints">
        <span class="hint"><kbd class="docs-kbd docs-kbd--sm">↑</kbd><kbd class="docs-kbd docs-kbd--sm">↓</kbd>navigate</span>
        <span class="hint"><kbd class="docs-kbd docs-kbd--sm">↵</kbd>open</span>
        <span class="hint hint--preview"><kbd class="docs-kbd docs-kbd--sm" data-blume-search-preview-kbd="">⌘J</kbd>preview</span>
      </div>
    </div>
  </dialog>

  <script data-blume-search-popular="" type="application/json">
    {JSON.stringify(popular)}
  </script>
</blume-search>
