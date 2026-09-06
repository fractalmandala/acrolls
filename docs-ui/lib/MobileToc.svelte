<script lang="ts">
  import "../styles/docs-layout.css";
  import TableOfContents from "./TableOfContents.svelte";

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
  }

  let {
    items = [
      { id: "the-islands-convention", label: "The islands/ convention", href: "#the-islands-convention", current: true },
      { id: "registering-islands-in-componentsts", label: "Registering islands in components.ts", href: "#registering-islands-in-componentsts" },
      { id: "hydration", label: "Hydration", href: "#hydration" },
      { id: "frameworks", label: "Frameworks", href: "#frameworks" },
      { id: "hooks", label: "Hooks", href: "#hooks" }
    ],
    title = "On this page"
  }: Props = $props();
</script>

<details class="docs-mobile-toc group">
  <summary>
    <span>{title}</span>
    <svg aria-hidden="true" class="group-open-icon" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6" />
    </svg>
  </summary>
  <TableOfContents {items} variant="mobile" />
</details>
