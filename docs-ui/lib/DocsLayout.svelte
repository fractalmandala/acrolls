<script lang="ts">
  import "../styles/theme-tokens.css";
  import "../styles/docs-layout.css";
  import "../styles/docs-prose.css";
  import "../styles/docs-search.css";
  import "../styles/docs-ui.css";
  import "../styles/blume-vendor.css";
  import type { Snippet } from "svelte";
  import { onMount } from "svelte";
  import DocsHeader from "./DocsHeader.svelte";
  import SidebarNav from "./SidebarNav.svelte";
  import TocRail from "./TocRail.svelte";

  interface Props {
    /** Sets <html data-theme> on mount when no stored value exists */
    defaultTheme?: "light" | "dark" | "system";
    /** Mobile drawer state; uncontrolled by default */
    navOpen?: boolean;
    header?: Snippet;
    sidebar?: Snippet;
    toc?: Snippet;
    children?: Snippet;
  }

  let {
    defaultTheme = "system",
    navOpen = $bindable(false),
    header,
    sidebar,
    toc,
    children
  }: Props = $props();

  function syncDrawerTop() {
    if (typeof document === "undefined") return;
    const h = document.querySelector("[data-blume-header]");
    if (h) {
      document.documentElement.style.setProperty(
        "--blume-drawer-top",
        `${h.getBoundingClientRect().bottom}px`
      );
    }
  }

  function closeNav() {
    navOpen = false;
    if (typeof document !== "undefined") {
      document.documentElement.removeAttribute("data-blume-nav-open");
      document.documentElement.style.overflow = "";
    }
  }

  $effect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.toggleAttribute("data-blume-nav-open", navOpen);
    document.documentElement.style.overflow = navOpen ? "hidden" : "";
    if (navOpen) syncDrawerTop();
  });

  onMount(() => {
    // Initial theme (mirrors original data-mode="system" script)
    try {
      const stored = localStorage.getItem("blume-theme");
      if (!stored) {
        const sys = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        document.documentElement.dataset.theme =
          defaultTheme === "system" ? sys : defaultTheme;
      }
    } catch {}
    syncDrawerTop();

    const onResize = () => {
      if (!document.documentElement.hasAttribute("data-blume-nav-open")) return;
      if (matchMedia("(min-width: 64rem)").matches) closeNav();
      else syncDrawerTop();
    };
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  });
</script>

<div class="docs-root" data-blume-code-copy="" data-blume-image-zoom="">
  <a class="docs-skip" href="#blume-content">Skip to content</a>

  {#if header}
    {@render header()}
  {:else}
    <DocsHeader onToggleNav={() => (navOpen = !navOpen)} />
  {/if}

  <div data-blume-doc-grid="">
    {#if sidebar}
      {@render sidebar()}
    {:else}
      <SidebarNav />
    {/if}

    {@render children?.()}

    {#if toc}
      {@render toc()}
    {:else}
      <TocRail />
    {/if}
  </div>

  <button
    aria-label="Close navigation"
    class="docs-nav-overlay"
    data-blume-nav-toggle=""
    type="button"
    onclick={closeNav}
  ></button>

  <!-- Machine-readable surface (mirrors <blume-webmcp hidden>) -->
  <blume-webmcp data-llms="true" data-search="true" hidden></blume-webmcp>
</div>
