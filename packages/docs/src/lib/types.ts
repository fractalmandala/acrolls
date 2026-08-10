/** Single leaf link in the docs sidebar. */
export type DocsNavItem = {
	/** Display title */
	title: string;
	/** Absolute or root-relative href */
	href: string;
	/** Optional slug (host routing convenience) */
	slug?: string;
	/** Optional short description (index pages, tooltips) */
	description?: string;
	/** Optional badge text */
	badge?: string;
};

/** Collapsible accordion section in the sidebar. */
export type DocsNavSection = {
	/** Stable id for open-state keys */
	id: string;
	/** Section heading */
	title: string;
	/** Open by default (and when a child is active) */
	defaultOpen?: boolean;
	items: DocsNavItem[];
};

/** Full docs nav tree for one documentation surface. */
export type DocsNav = {
	/** Sidebar product/docs title */
	title: string;
	/** Index href for this docs area */
	baseHref: string;
	/** Optional subtitle under title */
	subtitle?: string;
	sections: DocsNavSection[];
};

/** Breadcrumb segment. Last segment is typically non-linking current page. */
export type DocsCrumb = {
	label: string;
	href?: string;
};

export type DocsPagerLink = {
	title: string;
	href: string;
} | null;
