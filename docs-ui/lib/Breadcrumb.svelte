<script lang="ts">
  import "../styles/docs-layout.css";

  interface Props {
    /** Current section label, e.g. "Content" */
    trail?: string[];
    class?: string;
  }

  let { trail = [], class: klass = "" }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class="docs-breadcrumb {klass}">
  {#each trail as crumb, i (i)}
    {#if i > 0}<span aria-hidden="true"> / </span>{/if}
    <span>{crumb}</span>
  {/each}
</nav>
