<script lang="ts">
  import "../styles/docs-layout.css";
  import "../styles/docs-ui.css";
  import type { Snippet } from "svelte";
  import LanguageSwitcher from "./LanguageSwitcher.svelte";
  import SearchDialog from "./SearchDialog.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";

  interface SectionLink {
    label: string;
    href: string;
    current?: boolean;
  }

  interface Props {
    siteName?: string;
    homeHref?: string;
    sections?: SectionLink[];
    githubUrl?: string;
    onToggleNav?: () => void;
    brand?: Snippet;
  }

  let {
    siteName = "Blume",
    homeHref = "/",
    sections = [
      { label: "Docs", href: "/docs", current: true },
      { label: "CLI", href: "/cli" },
      { label: "Changelog", href: "/changelog/blume-1-6-3" }
    ],
    githubUrl = "https://github.com/haydenbleasel/blume",
    onToggleNav,
    brand
  }: Props = $props();

  function toggleNav() {
    if (onToggleNav) return onToggleNav();
    // Default: mirror original [data-blume-nav-open] behaviour
    const root = document.documentElement;
    const open = root.toggleAttribute("data-blume-nav-open");
    const header = document.querySelector("[data-blume-header]");
    if (open && header) {
      root.style.setProperty("--blume-drawer-top", `${header.getBoundingClientRect().bottom}px`);
    }
    root.style.overflow = open ? "hidden" : "";
  }
</script>

<header data-blume-header="">
  <button
    aria-label="Toggle navigation"
    class="docs-icon-btn lg:hidden"
    data-blume-nav-toggle=""
    type="button"
    onclick={toggleNav}
  >
    <svg aria-hidden="true" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16M4 12h16M4 19h16" />
    </svg>
  </button>

  <a class="docs-header-brand" href={homeHref}>
    {#if brand}
      {@render brand()}
    {:else}
      <span aria-hidden="true" class="docs-logo">
        <svg viewBox="0 0 288 320" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M143.797 1.015C168.964 1.015 189.366 21.417 189.366 46.585c0 25.167-20.402 45.57-45.569 45.57-25.167 0-45.57-20.403-45.57-45.57 0-25.167 20.398-45.569 45.57-45.57Z" fill="currentColor" stroke="currentColor" stroke-width="2.025" />
          <path d="M143.797 114.433c25.167 0 45.569 20.402 45.569 45.569 0 25.167-20.402 45.57-45.569 45.57-25.167 0-45.57-20.403-45.57-45.57 0-25.167 20.398-45.569 45.57-45.569Z" fill="currentColor" stroke="currentColor" stroke-width="2.025" />
          <path d="M46.582 57.725c25.167 0 45.569 20.402 45.569 45.569 0 25.168-20.402 45.571-45.569 45.571-25.167 0-45.569-20.403-45.569-45.571 0-25.167 20.402-45.569 45.569-45.569Z" fill="currentColor" stroke="currentColor" stroke-width="2.025" />
          <path d="M46.582 171.143c25.167 0 45.569 20.402 45.569 45.569 0 25.167-20.402 45.57-45.569 45.57-25.167 0-45.569-20.403-45.569-45.57 0-25.167 20.402-45.569 45.569-45.569Z" fill="currentColor" stroke="currentColor" stroke-width="2.025" />
          <path d="M241.012 57.725c25.167 0 45.569 20.402 45.569 45.569 0 25.168-20.402 45.571-45.569 45.571-25.168 0-45.57-20.403-45.57-45.571 0-25.167 20.403-45.569 45.57-45.569Z" fill="currentColor" stroke="currentColor" stroke-width="2.025" />
          <path d="M241.012 171.143c25.167 0 45.569 20.402 45.569 45.569 0 25.167-20.402 45.57-45.569 45.57-25.168 0-45.57-20.403-45.57-45.57 0-25.167 20.403-45.569 45.57-45.569Z" fill="currentColor" stroke="currentColor" stroke-width="2.025" />
          <path d="M143.797 227.85c25.167 0 45.569 20.402 45.569 45.569 0 25.168-20.402 45.571-45.569 45.571-25.167 0-45.57-20.403-45.57-45.571 0-25.167 20.398-45.569 45.57-45.569Z" fill="currentColor" stroke="currentColor" stroke-width="2.025" />
        </svg>
      </span>
      <span class="docs-name">{siteName}</span>
    {/if}
  </a>

  <nav aria-label="Sections" class="docs-header-sections">
    {#each sections as s (s.href)}
      <a href={s.href} aria-current={s.current ? "page" : undefined}>{s.label}</a>
    {/each}
  </nav>

  <div class="docs-header-spacer"></div>

  <LanguageSwitcher />

  <SearchDialog />

  <div class="docs-header-actions">
    <a aria-label="GitHub repository" class="docs-icon-btn" href={githubUrl} rel="noreferrer" target="_blank">
      <svg aria-hidden="true" fill="currentColor" height="18" viewBox="0 0 16 16" width="18" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
    </a>
    <ThemeToggle />
  </div>
</header>
