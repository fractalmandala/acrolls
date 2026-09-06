<script lang="ts">
  import "../styles/docs-prose.css";
  import type { Snippet } from "svelte";

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="blume-table-scroll" tabindex="0">
  <table>
    {@render children?.()}
  </table>
</div>
