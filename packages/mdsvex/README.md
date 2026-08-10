# @acrolls/mdsvex

Shared mdsvex options for Acrolls: GFM, heading slugs + anchors, table overflow wrap, Shiki dual-theme fences, and fence metadata.

```js
import { mdsvex } from 'mdsvex';
import { createAcrollsMdsvexOptions } from '@acrolls/mdsvex';

mdsvex(createAcrollsMdsvexOptions({ strict: false }));
```

Prefer `@acrolls/sveltekit` in SvelteKit hosts for layout path defaults.
