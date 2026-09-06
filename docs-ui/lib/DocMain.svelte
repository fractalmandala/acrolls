<script lang="ts">
  import "../styles/docs-layout.css";
  import "../styles/docs-prose.css";
  import "../styles/docs-ui.css";
  import type { Snippet } from "svelte";
  import Breadcrumb from "./Breadcrumb.svelte";
  import MobileToc from "./MobileToc.svelte";
  import PageFeedback from "./PageFeedback.svelte";
  import Pagination from "./Pagination.svelte";

  interface TocItem {
    id: string;
    label: string;
    href: string;
    depth?: number;
    current?: boolean;
  }

  interface Props {
    breadcrumb?: string[];
    title?: string;
    lede?: string;
    tocItems?: TocItem[];
    showMobileToc?: boolean;
    showFeedback?: boolean;
    prev?: { label: string; href: string } | null;
    next?: { label: string; href: string } | null;
    children?: Snippet;
  }

  let {
    breadcrumb = ["Content"],
    title = "Islands",
    lede = "Drop an interactive component into islands/ and use it in any MDX page — hydrated automatically, no per-page import.",
    tocItems = [
      { id: "the-islands-convention", label: "The islands/ convention", href: "#the-islands-convention", current: true },
      { id: "registering-islands-in-componentsts", label: "Registering islands in components.ts", href: "#registering-islands-in-componentsts" },
      { id: "hydration", label: "Hydration", href: "#hydration" },
      { id: "frameworks", label: "Frameworks", href: "#frameworks" },
      { id: "hooks", label: "Hooks", href: "#hooks" }
    ],
    showMobileToc = true,
    showFeedback = true,
    prev = { label: "Components", href: "/docs/content/components" },
    next = { label: "Content sources", href: "/docs/content/sources" },
    children
  }: Props = $props();
</script>

<main id="blume-content">
  <Breadcrumb trail={breadcrumb} />

  {#if showMobileToc}
    <MobileToc items={tocItems} />
  {/if}

  <article class="prose" dir="ltr" data-blume-article="">
    <h1>{title}</h1>
    {#if lede}<p class="docs-lede">{lede}</p>{/if}
    {@render children?.()}
  </article>

  {#if showFeedback}
    <PageFeedback />
  {/if}

  <Pagination {prev} {next} />
</main>
