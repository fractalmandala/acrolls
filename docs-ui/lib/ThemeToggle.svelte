<script lang="ts">
  import "../styles/docs-layout.css";
  import { onMount } from "svelte";

  interface Props {
    initial?: "light" | "dark" | "system";
    storageKey?: string;
  }

  let { initial = "system", storageKey = "blume-theme" }: Props = $props();

  let theme = $state<"light" | "dark">("light");

  function apply(next: "light" | "dark") {
    theme = next;
    if (typeof document !== "undefined") {
      // Suppress transitions for one frame (mirrors original inline script)
      const s = document.createElement("style");
      s.appendChild(document.createTextNode("*,*::before,*::after{transition:none!important}"));
      document.head.appendChild(s);
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(storageKey, next);
      } catch {}
      void window.getComputedStyle(document.documentElement).opacity;
      setTimeout(() => document.head.removeChild(s), 1);
    }
  }

  function toggle() {
    apply(theme === "dark" ? "light" : "dark");
  }

  onMount(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(storageKey);
    } catch {}
    const sys = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const resolved = stored === "dark" || stored === "light" ? stored : initial === "system" ? sys : initial;
    theme = resolved;
    document.documentElement.dataset.theme = resolved;
  });
</script>

<button
  aria-label="Toggle color theme"
  class="docs-icon-btn"
  data-blume-theme-toggle=""
  type="button"
  onclick={toggle}
>
  {#if theme === "dark"}
    <span class="hidden dark:inline-flex" style="display:inline-flex">
      <svg aria-hidden="true" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
      </svg>
    </span>
  {:else}
    <span class="inline-flex dark:hidden" style="display:inline-flex">
      <svg aria-hidden="true" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </g>
      </svg>
    </span>
  {/if}
</button>
