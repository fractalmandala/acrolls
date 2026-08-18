<script>
  /**
   * @typedef {Object} NavItem
   * @property {string} label
   * @property {string} href
   * @property {string} [icon] - SVG path data
   * @property {boolean} [active]
   * @property {NavItem[]} [children]
   */

  /** @type {NavItem[]} */
  export let sections = [];
</script>

<nav class="sidebar-nav" aria-label="Documentation navigation">
  {#each sections as section}
    <div class="nav-section">
      <div class="nav-section-title">{section.label}</div>
      {#each section.children || [] as item}
        <a
          href={item.href}
          class="nav-item"
          class:active={item.active}
        >
          {#if item.icon}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              {@html item.icon}
            </svg>
          {/if}
          {item.label}
        </a>
        {#if item.children}
          <div class="nav-sub">
            {#each item.children as sub}
              <a href={sub.href} class="nav-item" class:active={sub.active}>
                {sub.label}
              </a>
            {/each}
          </div>
        {/if}
      {/each}
    </div>
  {/each}
</nav>

<div
  class="sidebar-overlay"
  on:click={() => window.closeMobileNav?.()}
  role="presentation"
></div>
