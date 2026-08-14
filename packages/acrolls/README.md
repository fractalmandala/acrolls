# acrolls

The public Acrolls package: Markdown compiler, Svelte publication components, documentation
shell, styles, SvelteKit helpers, validation tools, and CLI.

```bash
pnpm add acrolls@latest
pnpm exec acrolls onboard --docs-dir docs --base-href /docs
pnpm exec acrolls validate ./docs --mode migration --on-invalid error-page
```

Public imports all come from this package:

```ts
import { createAcrollsMdsvexPreprocessor } from 'acrolls/mdsvex';
import { Publication } from 'acrolls/svelte';
import { DocsShell } from 'acrolls/docs';
import { createDocsContentSource } from 'acrolls/docs/content';
import 'acrolls/styles/default.css';
import 'acrolls/docs/styles.css';
```

Do not install or import `@acrolls/*` packages directly. They are bundled implementation units
behind the `acrolls/*` public entrypoints. The interactive onboarding flow shows one checkpoint
at a time; use `--non-interactive` or `--json` for agents and CI.
