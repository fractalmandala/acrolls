import type { DocsCrumb, DocsNav, DocsNavItem, DocsNavSection, DocsPagerLink } from './types.js';

/** Flatten all leaf items in section order. */
export function flattenDocsNav(nav: DocsNav): DocsNavItem[] {
	return nav.sections.flatMap((s) => s.items);
}

/** Find active item by pathname (exact or trailing-slash normalized). */
export function findActiveDocsItem(nav: DocsNav, pathname: string): DocsNavItem | null {
	const path = normalizePath(pathname);
	for (const item of flattenDocsNav(nav)) {
		if (normalizePath(item.href) === path) return item;
	}
	// prefix match longest href
	let best: DocsNavItem | null = null;
	for (const item of flattenDocsNav(nav)) {
		const href = normalizePath(item.href);
		if (path.startsWith(href + '/') || path === href) {
			if (!best || href.length > normalizePath(best.href).length) best = item;
		}
	}
	return best;
}

export function findActiveSection(nav: DocsNav, pathname: string): DocsNavSection | null {
	const active = findActiveDocsItem(nav, pathname);
	if (!active) return null;
	const path = normalizePath(active.href);
	return (
		nav.sections.find((s) => s.items.some((i) => normalizePath(i.href) === path)) ?? null
	);
}

/** Prev/next among flattened items. */
export function docsPager(nav: DocsNav, pathname: string): {
	previous: DocsPagerLink;
	next: DocsPagerLink;
} {
	const items = flattenDocsNav(nav);
	const path = normalizePath(pathname);
	const index = items.findIndex((i) => normalizePath(i.href) === path);
	if (index < 0) return { previous: null, next: null };
	const prev = index > 0 ? items[index - 1]! : null;
	const next = index < items.length - 1 ? items[index + 1]! : null;
	return {
		previous: prev ? { title: prev.title, href: prev.href } : null,
		next: next ? { title: next.title, href: next.href } : null
	};
}

/** Default crumbs: Home? → nav.title → section? → page */
export function buildDocsCrumbs(
	nav: DocsNav,
	pathname: string,
	options: { homeHref?: string; homeLabel?: string; includeSection?: boolean } = {}
): DocsCrumb[] {
	const { homeHref = '/', homeLabel = 'Home', includeSection = true } = options;
	const crumbs: DocsCrumb[] = [{ label: homeLabel, href: homeHref }];
	crumbs.push({ label: nav.title, href: nav.baseHref });

	const section = findActiveSection(nav, pathname);
	const active = findActiveDocsItem(nav, pathname);

	if (includeSection && section && active) {
		// section is not a page — label only
		crumbs.push({ label: section.title });
	}
	if (active) {
		crumbs.push({ label: active.title });
	} else if (normalizePath(pathname) === normalizePath(nav.baseHref)) {
		// index
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
	const path = normalizePath(pathname);
	return section.items.some((i) => normalizePath(i.href) === path);
}

function normalizePath(path: string): string {
	if (!path) return '/';
	const noHash = path.split('#')[0]!.split('?')[0]!;
	if (noHash.length > 1 && noHash.endsWith('/')) return noHash.slice(0, -1);
	return noHash || '/';
}
