<script>
  /**
   * @typedef {Object} Column
   * @property {string} label
   * @property {string} key
   */

  /** @type {Column[]} */
  export let columns = [];
  /** @type {Record<string, any>[]} */
  export let rows = [];
</script>

<div class="doc-table-wrap">
  <table class="doc-table">
    <thead>
      <tr>
        {#each columns as col}
          <th>{col.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each columns as col}
            <td>
              {@html row[col.key] ?? ''}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
