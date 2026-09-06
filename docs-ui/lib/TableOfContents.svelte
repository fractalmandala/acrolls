<script lang="ts">
  import "../styles/docs-layout.css";

  interface TocItem {
    id: string;
    label: string;
    href: string;
    depth?: number;
    current?: boolean;
  }

  interface Props {
    items?: TocItem[];
    /** "desktop" (plain list) or "mobile" (rounded list) */
    variant?: "desktop" | "mobile";
  }

  let { items = [], variant = "desktop" }: Props = $props();

  const linkClass =
    variant === "mobile"
      ? "block rounded-md px-2 py-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground aria-[current=location]:font-medium aria-[current=location]:text-foreground"
      : "docs-toc-link";
</script>

<blume-toc class="block">
  <ul class={variant === "mobile" ? "m-0 list-none border-border border-t p-2" : "docs-toc-list"}>
    {#each items as item (item.id)}
      <li data-depth={item.depth ?? 2} style="padding-inline-start:0rem">
        <a
          class={linkClass}
          href={item.href}
          aria-current={item.current ? "location" : undefined}
        >
          {item.label}
        </a>
      </li>
    {/each}
  </ul>
</blume-toc>
