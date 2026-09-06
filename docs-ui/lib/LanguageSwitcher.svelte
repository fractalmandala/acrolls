<script lang="ts">
  import "../styles/docs-ui.css";

  interface Language {
    code: string;
    label: string;
    href: string;
    current?: boolean;
  }

  interface Props {
    languages?: Language[];
    label?: string;
  }

  let {
    languages = [
      { code: "en", label: "English", href: "/docs/content/islands", current: true },
      { code: "de", label: "Deutsch", href: "/de/docs/content/islands" },
      { code: "hi", label: "हिन्दी", href: "/hi/docs/content/islands" },
      { code: "ja", label: "日本語", href: "/ja/docs/content/islands" },
      { code: "pt", label: "Português", href: "/pt/docs/content/islands" }
    ],
    label = "English"
  }: Props = $props();
</script>

<details class="group relative" data-blume-dropdown="">
  <summary aria-label="Language" class="docs-lang-trigger list-none [&::-webkit-details-marker]:hidden">
    <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
      </g>
    </svg>
    <span class="lang-label">{label}</span>
    <svg aria-hidden="true" class="chev transition-transform group-open:rotate-180" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
    </svg>
  </summary>
  <div data-blume-menu="">
    {#each languages as lang (lang.code)}
      <a
        class="docs-menu-item"
        href={lang.href}
        hreflang={lang.code}
        lang={lang.code}
        aria-current={lang.current ? "true" : undefined}
      >
        <span class="grow">{lang.label}</span>
        {#if lang.current}
          <svg aria-hidden="true" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6 9 17l-5-5" />
          </svg>
        {/if}
      </a>
    {/each}
  </div>
</details>
