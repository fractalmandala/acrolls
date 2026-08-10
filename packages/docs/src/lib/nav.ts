import type {
	DocsCrumb,
	DocsNav,
	DocsNavNode,
	DocsNavSection,
	DocsPagerLink
} from './types.js';
import { normalizePath, slugify } from './nav-path.js';

export { normalizePath, slugify } from './nav-path.js';

/** Ensure every node has a stable id. */
export function withNavIds(nav: DocsNav): DocsNav {
	return {
		...nav,
		sections: nav.sections.map((section) => ({
			...section,
			items: section.items.map((item, i) => stampIds(item, `${section.id}/${i}`))
		}))
	};
}

function stampIds(node: DocsNavNode, path: string): DocsNavNode {
	const id = node.id ?? (slugify(path + '-' + node.title) || path);
	return {
		...node,
		id,
		children: node.children?.map((c, i) => stampIds(c, `${id}/${i}`))
	};
}

/** Leaf pages only (nodes with href), depth-first. */
export function flattenDocsNav(nav: DocsNav): DocsNavNode[] {
	const out: DocsNavNode[] = [];
	const walk = (nodes: DocsNavNode[]) => {
		for (const n of nodes) {
			if (n.href) out.push(n);
			if (n.children?.length) walk(n.children);
		}
	};
	for (const s of nav.sections) walk(s.items);
	return out;
}

/** True if node or any descendant matches pathname. */
export function nodeContainsPath(node: DocsNavNode, pathname: string): boolean {
	const path = normalizePath(pathname);
	if (node.href && normalizePath(node.href) === path) return true;
	return node.children?.some((c) => nodeContainsPath(c, pathname)) ?? false;
}

export function findActiveDocsItem(nav: DocsNav, pathname: string): DocsNavNode | null {
	const path = normalizePath(pathname);
	const leaves = flattenDocsNav(nav);
	const exact = leaves.find((i) => i.href && normalizePath(i.href) === path);
	if (exact) return exact;
	let best: DocsNavNode | null = null;
	for (const item of leaves) {
		if (!item.href) continue;
		const href = normalizePath(item.href);
		if (path.startsWith(href + '/') || path === href) {
			if (!best || href.length > normalizePath(best.href!).length) best = item;
		}
	}
	return best;
}

/** Ancestor chain of titles from section → … → page (for crumbs). */
export function findActiveTrail(
	nav: DocsNav,
	pathname: string
): { section: DocsNavSection; nodes: DocsNavNode[] } | null {
	const path = normalizePath(pathname);
	for (const section of nav.sections) {
		const trail = findTrailInNodes(section.items, path, []);
		if (trail) return { section, nodes: trail };
	}
	return null;
}

function findTrailInNodes(
	nodes: DocsNavNode[],
	path: string,
	ancestors: DocsNavNode[]
): DocsNavNode[] | null {
	for (const node of nodes) {
		const next = [...ancestors, node];
		if (node.href && normalizePath(node.href) === path) return next;
		if (node.children?.length) {
			const found = findTrailInNodes(node.children, path, next);
			if (found) return found;
		}
	}
	return null;
}

export function findActiveSection(nav: DocsNav, pathname: string): DocsNavSection | null {
	return findActiveTrail(nav, pathname)?.section ?? null;
}

export function docsPager(
	nav: DocsNav,
	pathname: string
): { previous: DocsPagerLink; next: DocsPagerLink } {
	const items = flattenDocsNav(nav).filter((i) => i.href);
	const path = normalizePath(pathname);
	const index = items.findIndex((i) => normalizePath(i.href!) === path);
	if (index < 0) return { previous: null, next: null };
	const prev = index > 0 ? items[index - 1]! : null;
	const nxt = index < items.length - 1 ? items[index + 1]! : null;
	return {
		previous: prev?.href ? { title: prev.title, href: prev.href } : null,
		next: nxt?.href ? { title: nxt.title, href: nxt.href } : null
	};
}

export function buildDocsCrumbs(
	nav: DocsNav,
	pathname: string,
	options: { homeHref?: string; homeLabel?: string; includeSection?: boolean } = {}
): DocsCrumb[] {
	const { homeHref = '/', homeLabel = 'Home', includeSection = true } = options;
	const crumbs: DocsCrumb[] = [
		{ label: homeLabel, href: homeHref },
		{ label: nav.title, href: nav.baseHref }
	];

	const trail = findActiveTrail(nav, pathname);
	if (!trail) return crumbs;

	if (includeSection) {
		crumbs.push({ label: trail.section.title });
	}

	// intermediate groups (all but last) as labels; last is page
	const nodes = trail.nodes;
	for (let i = 0; i < nodes.length; i++) {
		const n = nodes[i]!;
		const isLast = i === nodes.length - 1;
		if (isLast) {
			crumbs.push({ label: n.title });
		} else if (n.href) {
			crumbs.push({ label: n.title, href: n.href });
		} else {
			crumbs.push({ label: n.title });
		}
	}
	return crumbs;
}

export function sectionShouldOpen(
	section: DocsNavSection,
	pathname: string,
	forcedOpenIds?: Set<string>
): boolean {
	if (forcedOpenIds?.has(section.id)) return true;
	if (section.defaultOpen) return true;
	return section.items.some((i) => nodeContainsPath(i, pathname));
}

export function nodeShouldOpen(
	node: DocsNavNode,
	pathname: string,
	forcedOpenIds?: Set<string>
): boolean {
	const id = node.id ?? '';
	if (id && forcedOpenIds?.has(id)) return true;
	if (node.defaultOpen) return true;
	return nodeContainsPath(node, pathname);
}

export function navStorageKey(nav: DocsNav): string {
	return nav.storageKey ?? (slugify(nav.title) || 'docs');
}

/** Collect all group ids that should be open for the active path. */
export function openIdsForPath(nav: DocsNav, pathname: string): string[] {
	const ids: string[] = [];
	for (const section of nav.sections) {
		if (section.items.some((i) => nodeContainsPath(i, pathname))) {
			ids.push(section.id);
			collectOpenNodeIds(section.items, pathname, ids);
		} else if (section.defaultOpen) {
			ids.push(section.id);
		}
	}
	return ids;
}

function collectOpenNodeIds(nodes: DocsNavNode[], pathname: string, ids: string[]) {
	for (const n of nodes) {
		if (n.children?.length && nodeContainsPath(n, pathname)) {
			if (n.id) ids.push(n.id);
			collectOpenNodeIds(n.children, pathname, ids);
		} else if (n.defaultOpen && n.id) {
			ids.push(n.id);
		}
	}
}
