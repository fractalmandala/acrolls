import { createAcrollsMdsvexOptions, type AcrollsMdsvexOptions } from '@acrolls/mdsvex';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export type { AcrollsMdsvexOptions };
export { createAcrollsMdsvexOptions } from '@acrolls/mdsvex';

function resolvePublicationLayout(): string {
  try {
    const require = createRequire(import.meta.url);
    const pkg = require.resolve('@acrolls/svelte/package.json');
    // Prefer source layout path for monorepo / package "src" shipping
    const candidates = [
      join(dirname(pkg), 'src/lib/PublicationLayout.svelte'),
      join(dirname(pkg), 'dist/PublicationLayout.svelte')
    ];
    return candidates[0]!;
  } catch {
    // Fallback relative (consumers should set layout explicitly if resolution fails)
    return '@acrolls/svelte/src/lib/PublicationLayout.svelte';
  }
}

/**
 * mdsvex options with Acrolls layout default for SvelteKit hosts.
 */
export function createAcrollsSvelteKitMdsvexOptions(
  options: AcrollsMdsvexOptions = {}
) {
  const layout =
    options.layout ??
    ({
      _: resolvePublicationLayout()
    } as Record<string, string>);

  return createAcrollsMdsvexOptions({
    ...options,
    layout,
    extensions: options.extensions ?? ['.svx', '.md']
  });
}

// Alias used in PRODUCT/TECH docs
export const createAcrollsKitOptions = createAcrollsSvelteKitMdsvexOptions;
