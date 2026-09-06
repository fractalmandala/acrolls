<script lang="ts">
  import "../styles/docs-layout.css";

  interface NavItem {
    label: string;
    href: string;
    current?: boolean;
  }

  interface NavGroup {
    label?: string;
    items: NavItem[];
  }

  interface Props {
    /** Top tab links (Docs / CLI / Changelog) — mobile only copy */
    sections?: NavItem[];
    /** Sidebar groups: top-level pages + Content/Configuration/Advanced/Reference */
    groups?: NavGroup[];
    currentPath?: string;
  }

  let {
    sections = [
      { label: "Docs", href: "/docs", current: true },
      { label: "CLI", href: "/cli" },
      { label: "Changelog", href: "/changelog/blume-1-6-3" }
    ],
    groups = [
      {
        items: [
          { label: "Introduction", href: "/docs" },
          { label: "Quickstart", href: "/docs/quickstart" },
          { label: "Deployment", href: "/docs/deployment" },
          { label: "FAQ", href: "/docs/faq" }
        ]
      },
      {
        label: "Content",
        items: [
          { label: "Pages", href: "/docs/content" },
          { label: "Navigation", href: "/docs/content/navigation" },
          { label: "Folder meta", href: "/docs/content/meta" },
          { label: "Syntax", href: "/docs/content/syntax" },
          { label: "Includes", href: "/docs/content/includes" },
          { label: "Components", href: "/docs/content/components" },
          { label: "Islands", href: "/docs/content/islands", current: true },
          { label: "Content sources", href: "/docs/content/sources" },
          { label: "Internationalization", href: "/docs/content/i18n" },
          { label: "Versioning", href: "/docs/content/versioning" }
        ]
      },
      {
        label: "Configuration",
        items: [
          { label: "blume.config.ts", href: "/docs/configuration" },
          { label: "Theming", href: "/docs/configuration/theming" },
          { label: "Customization", href: "/docs/configuration/customization" },
          { label: "Search", href: "/docs/configuration/search" },
          { label: "AI", href: "/docs/configuration/ai" },
          { label: "Analytics", href: "/docs/configuration/analytics" },
          { label: "Export", href: "/docs/configuration/export" },
          { label: "SEO", href: "/docs/configuration/seo" }
        ]
      },
      {
        label: "Advanced",
        items: [
          { label: "Skills", href: "/docs/advanced/skills" },
          { label: "Custom Pages", href: "/docs/advanced/custom-pages" },
          { label: "Changelog", href: "/docs/advanced/changelog" },
          { label: "Blog", href: "/docs/advanced/blog" },
          { label: "OpenAPI / AsyncAPI", href: "/docs/advanced/api-reference" },
          { label: "GraphQL", href: "/docs/advanced/graphql" }
        ]
      },
      {
        label: "Reference",
        items: [
          { label: "Frontmatter", href: "/docs/reference/frontmatter" },
          { label: "CLI", href: "/docs/reference/cli" },
          { label: "Evals", href: "/docs/reference/eval" },
          { label: "Translate", href: "/docs/reference/translate" }
        ]
      }
    ],
    currentPath = ""
  }: Props = $props();

  function isCurrent(item: NavItem): boolean {
    if (item.current !== undefined) return item.current;
    return currentPath !== "" && item.href === currentPath;
  }
</script>

<aside aria-label="Primary" data-blume-nav-drawer="">
  <nav aria-label="Sections" class="docs-nav-sections-mobile">
    <ul class="docs-nav-list">
      {#each sections as s (s.href)}
        <li>
          <a class="docs-nav-link" href={s.href} aria-current={isCurrent(s) ? "page" : undefined}>
            {s.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <nav data-blume-nav-tree="">
    <ul class="docs-nav-list docs-nav-list--spaced">
      {#each groups as group, gi (gi)}
        <li class:docs-nav-group={!!group.label} class:mt-6={gi > 0 && !!group.label}>
          {#if group.label}
            <p class="docs-nav-group-title"><span class="truncate">{group.label}</span></p>
            <div class="space-y-0.5">
              <ul class="docs-nav-list docs-nav-list--spaced">
                {#each group.items as item (item.href)}
                  <li>
                    <a class="docs-nav-link" href={item.href} aria-current={isCurrent(item) ? "page" : undefined}>
                      <span class="docs-nav-link-row"><span class="grow">{item.label}</span></span>
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          {:else}
            {#each group.items as item (item.href)}
              <li>
                <a class="docs-nav-link" href={item.href} aria-current={isCurrent(item) ? "page" : undefined}>
                  <span class="docs-nav-link-row"><span class="grow">{item.label}</span></span>
                </a>
              </li>
            {/each}
          {/if}
        </li>
      {/each}
    </ul>
  </nav>
</aside>
