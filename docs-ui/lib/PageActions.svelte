<script lang="ts">
  import "../styles/docs-ui.css";

  interface ChatLink {
    label: string;
    href: string;
    openIn: string;
  }

  interface Props {
    editUrl?: string;
    mdPath?: string;
    pageUrl?: string;
    mcpName?: string;
    mcpUrl?: string;
    chatLinks?: ChatLink[];
    copyLabel?: string;
  }

  let {
    editUrl = "https://github.com/haydenbleasel/blume/edit/main/apps/docs/content/docs/content/islands.mdx",
    mdPath = "/docs/content/islands.md",
    pageUrl = "https://useblume.dev/docs/content/islands.md",
    mcpName = "Blume",
    mcpUrl = "https://useblume.dev/mcp",
    chatLinks = [
      { label: "Open in v0", openIn: "v0", href: "https://v0.app/?q=Read%20https%3A%2F%2Fuseblume.dev%2Fdocs%2Fcontent%2Fislands.md%20so%20I%20can%20ask%20you%20questions%20about%20this%20page." },
      { label: "Open in ChatGPT", openIn: "chatgpt", href: "https://chatgpt.com/?hints=search&prompt=Read%20https%3A%2F%2Fuseblume.dev%2Fdocs%2Fcontent%2Fislands.md%20so%20I%20can%20ask%20you%20questions%20about%20this%20page." },
      { label: "Open in Claude", openIn: "claude", href: "https://claude.ai/new?q=Read%20https%3A%2F%2Fuseblume.dev%2Fdocs%2Fcontent%2Fislands.md%20so%20I%20can%20ask%20you%20questions%20about%20this%20page." },
      { label: "Open in T3 Chat", openIn: "t3", href: "https://t3.chat/new?q=Read%20https%3A%2F%2Fuseblume.dev%2Fdocs%2Fcontent%2Fislands.md%20so%20I%20can%20ask%20you%20questions%20about%20this%20page." }
    ],
    copyLabel = "Copy as Markdown"
  }: Props = $props();

  let copyState = $state("Copy as Markdown");

  async function copyPage() {
    try {
      const res = await fetch(pageUrl);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      copyState = "Copied!";
    } catch {
      copyState = "Copy failed";
    }
    setTimeout(() => (copyState = copyLabel), 1600);
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function exportPdf() {
    window.print();
  }

  function exportEpub() {
    window.dispatchEvent(new CustomEvent("blume:export-epub", { detail: { mdPath } }));
  }
</script>

<div
  class="docs-page-actions"
  data-blume-page-actions=""
  data-i18n-chat-prompt="Read {url} so I can ask you questions about this page."
  data-i18n-copied="Copied!"
  data-i18n-copy-failed="Copy failed"
  data-i18n-generating="Generating…"
  data-mcp-name={mcpName}
  data-mcp-url={mcpUrl}
  data-md={mdPath}
>
  <a class="docs-row-action" href={editUrl} rel="noreferrer" target="_blank">
    <svg class="size-4 shrink-0" fill="currentColor" viewBox="0 0 16 16" width="14" height="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.013 2.513a1.75 1.75 0 0 1 2.474 2.474l-8.14 8.14a1.75 1.75 0 0 1-.74.44l-2.3.575a.75.75 0 0 1-.914-.914l.575-2.3a1.75 1.75 0 0 1 .44-.74l8.14-8.14Zm1.414 1.06a.25.25 0 0 0-.354 0L4.47 11.177a.25.25 0 0 0-.063.106l-.558 2.234 2.234-.558a.25.25 0 0 0 .106-.063l7.604-7.604a.25.25 0 0 0 0-.354l-1.266-1.365Z" />
    </svg>
    Edit on GitHub
  </a>

  <button class="docs-row-action" data-blume-scroll-top="" type="button" onclick={scrollTop}>
    <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12 7-7 7 7m-7 7V5" />
    </svg>
    Scroll to top
  </button>

  <button class="docs-row-action" data-blume-copy-page="" type="button" onclick={copyPage}>
    <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </g>
    </svg>
    <span data-blume-copy-label="">{copyState}</span>
  </button>

  <details class="group relative" data-blume-dropdown="">
    <summary class="docs-row-action cursor-pointer list-none [&::-webkit-details-marker]:hidden">
      <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m7 10 5 5 5-5" />
        </g>
      </svg>
      Export
      <svg aria-hidden="true" class="chev ms-auto transition-transform group-open:rotate-180" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
      </svg>
    </summary>
    <div data-blume-menu="">
      <button class="docs-menu-item" data-blume-export-pdf="" type="button" onclick={exportPdf}>
        <span class="grow">Export to PDF</span>
      </button>
      <button class="docs-menu-item" data-blume-export-epub="" type="button" onclick={exportEpub}>
        <span class="grow" data-blume-epub-label="">Export to EPUB</span>
      </button>
    </div>
  </details>

  <details class="group relative" data-blume-dropdown="">
    <summary class="docs-row-action cursor-pointer list-none [&::-webkit-details-marker]:hidden">
      <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </svg>
      Open in chat
      <svg aria-hidden="true" class="chev ms-auto transition-transform group-open:rotate-180" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
      </svg>
    </summary>
    <div data-blume-menu="">
      {#each chatLinks as link (link.openIn)}
        <a class="docs-menu-item" data-open-in={link.openIn} rel="noreferrer" target="_blank" href={link.href}>
          <span class="grow">{link.label}</span>
          <svg aria-hidden="true" height="13" viewBox="0 0 24 24" width="13" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
        </a>
      {/each}
      <hr class="docs-menu-sep" />
      <button
        class="docs-menu-item"
        type="button"
        onclick={() => window.open(`vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name: mcpName.toLowerCase(), type: "http", url: mcpUrl }))}`, "_blank")}
      >
        <span class="grow">Add to VS Code</span>
      </button>
    </div>
  </details>

  <details class="group relative" data-blume-dropdown="">
    <summary class="docs-row-action cursor-pointer list-none [&::-webkit-details-marker]:hidden">
      <svg aria-hidden="true" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22v-5m3-9V2m2 6a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1zM9 8V2" />
      </svg>
      Connect to MCP
      <svg aria-hidden="true" class="chev ms-auto transition-transform group-open:rotate-180" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
      </svg>
    </summary>
    <div data-blume-menu="">
      <button
        class="docs-menu-item"
        data-mcp-copy-url=""
        type="button"
        onclick={() => navigator.clipboard?.writeText(mcpUrl)}
      >
        <span class="grow" data-mcp-url-label="">Copy server URL</span>
      </button>
      <button
        class="docs-menu-item"
        type="button"
        onclick={() => navigator.clipboard?.writeText(`blume mcp add --url ${mcpUrl}`)}
      >
        <span class="grow">Copy Claude Code command</span>
      </button>
    </div>
  </details>
</div>
