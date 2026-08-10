/** Shared path normalize (kept tiny for component imports). */
export function normalizePath(path: string): string {
	if (!path) return '/';
	const bare = path.split('#')[0]!.split('?')[0]!;
	if (bare.length > 1 && bare.endsWith('/')) return bare.slice(0, -1);
	return bare || '/';
}
