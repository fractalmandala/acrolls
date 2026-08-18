<script>
  /** @type {string} */
  export let language = '';
  /** @type {string} */
  export let code = '';
  /** @type {boolean} */
  export let showCopy = true;

  let copied = false;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch {
      /* clipboard not available */
    }
  }
</script>

<div class="doc-code-block">
  <div class="doc-code-header">
    {#if language}
      <span class="doc-code-lang">{language}</span>
    {/if}
    {#if showCopy}
      <button class="doc-code-copy" on:click={copyToClipboard} aria-label="Copy code">
        {#if copied}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Copied
        {:else}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          Copy
        {/if}
      </button>
    {/if}
  </div>
  <div class="doc-code-body">
    <pre><slot>{code}</slot></pre>
  </div>
</div>
