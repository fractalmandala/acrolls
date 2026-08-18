<script>
  /**
   * @typedef {Object} Link
   * @property {string} href
   * @property {string} label
   * @property {string} title
   */

  /** @type {Link | null} */
  export let prev = null;
  /** @type {Link | null} */
  export let next = null;
</script>

<nav class="doc-footer-nav" aria-label="Pager">
  {#if prev}
    <a href={prev.href} class="doc-footer-link prev">
      <div class="doc-footer-link-label">{prev.label}</div>
      <div class="doc-footer-link-title">{prev.title}</div>
    </a>
  {/if}
  {#if next}
    <a href={next.href} class="doc-footer-link next">
      <div class="doc-footer-link-label">{next.label}</div>
      <div class="doc-footer-link-title">{next.title}</div>
    </a>
  {/if}
</nav>
