<script>
  /**
   * @typedef {Object} Step
   * @property {string} title
   * @property {string} body - may contain inline HTML (e.g. <code>)
   */

  /** @type {Step[]} */
  export let steps = [];
</script>

<ol class="doc-steps">
  {#each steps as step}
    <li class="doc-step">
      <div class="doc-step-title">{step.title}</div>
      <div class="doc-step-body">{@html step.body}</div>
    </li>
  {/each}
</ol>
