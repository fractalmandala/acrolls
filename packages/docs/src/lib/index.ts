export type {
	DocsNav,
	DocsNavNode,
	DocsNavItem,
	DocsNavSection,
	DocsCrumb,
	DocsPagerLink,
	DocsTocItem
} from './types.js';

export {
	flattenDocsNav,
	findActiveDocsItem,
	findActiveSection,
	findActiveTrail,
	docsPager,
	buildDocsCrumbs,
	sectionShouldOpen,
	nodeShouldOpen,
	nodeContainsPath,
	withNavIds,
	navStorageKey,
	openIdsForPath,
	normalizePath,
	slugify
} from './nav.js';

export { scanHeadings } from './toc.js';
export { readOpenState, writeOpenState, clearOpenState } from './storage.js';

export { default as DocsShell } from './DocsShell.svelte';
export { default as DocsSidebar } from './DocsSidebar.svelte';
export { default as DocsAccordion } from './DocsAccordion.svelte';
export { default as DocsNavTree } from './DocsNavTree.svelte';
export { default as DocsBreadcrumbs } from './DocsBreadcrumbs.svelte';
export { default as DocsPager } from './DocsPager.svelte';
export { default as DocsToc } from './DocsToc.svelte';
