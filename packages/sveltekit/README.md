# @acrolls/sveltekit

```js
import { mdsvex } from 'mdsvex';
import { createAcrollsSvelteKitMdsvexOptions } from '@acrolls/sveltekit';

preprocess: [vitePreprocess(), mdsvex(createAcrollsSvelteKitMdsvexOptions())]
```

Also re-exports `createAcrollsMdsvexOptions` from `@acrolls/mdsvex`.
