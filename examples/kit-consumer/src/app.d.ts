declare global {
  namespace App {}
}

export {};

declare module '*.md' {
  import type { Component } from 'svelte';
  export default Component;
  export const metadata: Record<string, unknown>;
}

declare module '*.svx' {
  import type { Component } from 'svelte';
  export default Component;
  export const metadata: Record<string, unknown>;
}
