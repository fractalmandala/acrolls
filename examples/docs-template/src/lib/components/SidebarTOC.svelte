<script>
  import { onMount, onDestroy } from 'svelte';

  /**
   * @typedef {Object} TocEntry
   * @property {string} id
   * @property {string} label
   * @property {number} level - 2 or 3
   */

  /** @type {TocEntry[]} */
  export let entries = [];

  let activeId = '';

  function updateActive() {
    const headerHeight = 80;
    let current = entries[0];

    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= headerHeight + 20) {
          current = entry;
        }
      }
    }

    if (current) activeId = current.id;
  }

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
      ticking = true;
    }
  }

  onMount(() => {
    updateActive();
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', onScroll);
    }
  });
</script>

<aside class="sidebar-toc" aria-label="Table of contents">
  <div class="toc-title">On this page</div>
  <ul class="toc-list">
    {#each entries as entry}
      <li class="toc-item">
        <a
          href="#{entry.id}"
          class="toc-link"
          class:active={activeId === entry.id}
          data-level={entry.level}
        >
          {entry.label}
        </a>
      </li>
    {/each}
  </ul>
</aside>
