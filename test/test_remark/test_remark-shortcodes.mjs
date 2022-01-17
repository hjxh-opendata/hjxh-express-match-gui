// const unified = require('unified');
import { unified } from 'unified';
// const parse = require('remark-parse');
import remarkParse from 'remark-parse';
// const shortcodes = require('remark-shortcodes');
import shortcodes from 'remark-shortcodes';

const markdown = 'Example paragraph\n\n{{> MailchimpForm id="chfk2" <}}';

const tree = unified()
  .use(remarkParse)
  // Plugin inserted below, with custom options for start/end blocks.
  .use(shortcodes, { startBlock: '{{>', endBlock: '<}}' })
  // Turn off position output for legibility below.
  .data('settings', { position: false })
  .parse(markdown);

console.dir(tree, { depth: null });
