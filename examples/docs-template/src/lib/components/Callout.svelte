<script>
  /**
   * @type {'note' | 'tip' | 'warn' | 'danger'}
   */
  export let variant = 'note';
  /** @type {string} */
  export let title = '';

  const icons = {
    note: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    tip: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    warn: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    danger: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  };

  const defaultTitles = { note: 'Note', tip: 'Tip', warn: 'Warning', danger: 'Danger' };
</script>

<div class="doc-callout doc-callout-{variant}">
  <svg class="doc-callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    {@html icons[variant]}
  </svg>
  <div class="doc-callout-content">
    <div class="doc-callout-title">{title || defaultTitles[variant]}</div>
    <div class="doc-callout-body">
      <slot />
    </div>
  </div>
</div>
