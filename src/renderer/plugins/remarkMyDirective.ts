import { visit } from 'unist-util-visit';

export const remarkMyDirective = () => (tree: any) => {
  visit(tree, 'containerDirective', (node) => {
    // ref: [remarkjs/remark-directive: remark plugin to support directives](https://github.com/remarkjs/remark-directive)
    const hProperties = {
      class: `directive ${node.name} ${node.attributes.class || ''}`,
    };
    node.data = { ...node.data, hProperties };
  });
};

export default { remarkMyDirective };
