import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * Wrap bare tables in a keyboard-focusable overflow region.
 */
export function rehypeAcrollsTableWrap() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent || typeof index !== 'number') return;
      // already wrapped
      if (
        parent.type === 'element' &&
        (parent as Element).properties?.className &&
        String((parent as Element).properties?.className).includes('acrolls-table-wrap')
      ) {
        return;
      }

      const wrap: Element = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['acrolls-table-wrap'],
          tabIndex: 0,
          role: 'region',
          ariaLabel: 'Scrollable table'
        },
        children: [node]
      };
      parent.children[index] = wrap;
    });
  };
}
