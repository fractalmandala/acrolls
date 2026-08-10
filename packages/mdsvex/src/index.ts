import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { createAcrollsHighlighter, type HighlightOptions } from './highlighter.js';
import { rehypeAcrollsTableWrap } from './rehype-table-wrap.js';
import { rehypeAcrollsHeadingAnchors } from './rehype-heading-anchors.js';

export { parseFenceMeta, parseRangeList } from './code-meta.js';
export { createAcrollsHighlighter } from './highlighter.js';
export type { HighlightOptions } from './highlighter.js';
export { rehypeAcrollsTableWrap } from './rehype-table-wrap.js';
export { rehypeAcrollsHeadingAnchors } from './rehype-heading-anchors.js';
export { rehypeAcrollsCode } from './rehype-code.js';
export { remarkAcrollsCodeMeta } from './remark-code-meta.js';
export { renderAcrollsArticleHtml } from './render-html.js';
export type { RenderHtmlResult } from './render-html.js';
export { splitFrontmatter, renderBannerHtml } from './frontmatter.js';
export type { Frontmatter } from './frontmatter.js';

export type AcrollsMdsvexOptions = HighlightOptions & {
  /** Path to Publication layout (host or package). */
  layout?: string | Record<string, string>;
  extensions?: string[];
};

/**
 * Options object for mdsvex(...).
 * Layout should point at a Svelte component that wraps slot content in Publication.
 */
export function createAcrollsMdsvexOptions(options: AcrollsMdsvexOptions = {}) {
  const {
    strict = false,
    layout,
    extensions = ['.svx', '.md']
  } = options;

  return {
    extensions,
    layout,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAcrollsHeadingAnchors, rehypeAcrollsTableWrap],
    highlight: {
      highlighter: createAcrollsHighlighter({ strict })
    }
  };
}
