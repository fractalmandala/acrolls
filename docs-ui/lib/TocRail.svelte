<script lang="ts">
  import "../styles/docs-layout.css";
  import TableOfContents from "./TableOfContents.svelte";
  import PageActions from "./PageActions.svelte";

  interface TocItem {
    id: string;
    label: string;
    href: string;
    depth?: number;
    current?: boolean;
  }

  interface Props {
    items?: TocItem[];
    title?: string;
    showActions?: boolean;
    editUrl?: string;
    mdPath?: string;
    pageUrl?: string;
  }

  let {
    items = [
      { id: "the-islands-convention", label: "The islands/ convention", href: "#the-islands-convention", current: true },
      { id: "registering-islands-in-componentsts", label: "Registering islands in components.ts", href: "#registering-islands-in-componentsts" },
      { id: "hydration", label: "Hydration", href: "#hydration" },
      { id: "frameworks", label: "Frameworks", href: "#frameworks" },
      { id: "hooks", label: "Hooks", href: "#hooks" }
    ],
    title = "On this page",
    showActions = true,
    editUrl,
    mdPath,
    pageUrl
  }: Props = $props();
</script>

<!--
  Right rail. NOTE: in the original HTML, [data-blume-page-actions]
  lives INSIDE this <aside> — preserved here intentionally.
-->
<aside aria-label="On this page" data-blume-toc="">
  <p class="docs-toc-title">{title}</p>
  <TableOfContents {items} variant="desktop" />
  {#if showActions}
    <PageActions {editUrl} {mdPath} {pageUrl} />
  {/if}
</aside>
