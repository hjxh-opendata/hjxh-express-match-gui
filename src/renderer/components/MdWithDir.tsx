import ReactMarkdown from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';

import { remarkMyDirective } from '../plugins/remarkMyDirective';

export interface MDWithDirProps {
  content: string;
}

export const MdWithDir = (props: MDWithDirProps) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkParse, remarkDirective, remarkMyDirective, remarkGfm]}>
      {props.content}
    </ReactMarkdown>
  );
};

export default MdWithDir;
