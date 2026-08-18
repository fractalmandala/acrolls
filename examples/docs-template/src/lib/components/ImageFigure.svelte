<script>
  /** @type {string} */
  export let src = '';
  /** @type {string} */
  export let alt = '';
  /** @type {string} */
  export let caption = '';
</script>

<figure class="doc-img-wrap">
  {#if src}
    <img {src} {alt} style="width: 100%; display: block;" />
  {:else}
    <div class="doc-img-placeholder">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span>{alt || 'Image placeholder'}</span>
    </div>
  {/if}
  {#if caption}
    <figcaption class="doc-img-caption">{caption}</figcaption>
  {/if}
</figure>
