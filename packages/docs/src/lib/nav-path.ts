/** Shared path normalize. */
export function normalizePath(path: string): string {
	if (!path) return '/';
	const bare = path.split('#')[0]!.split('?')[0]!;
	if (bare.length > 1 && bare.endsWith('/')) return bare.slice(0, -1);
	return bare || '/';
}

/** Slugify for storage keys / auto ids. */
export function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 64);
}
