import ReactMarkdown from 'react-markdown';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import { remarkMyDirective } from '../utils/remarkMyDirective';

export interface MDWithDirProps {
  content: string;
}
export const MdWithDir = (props: MDWithDirProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkParse, remarkDirective, remarkMyDirective]}
    >
      {props.content}
    </ReactMarkdown>
  );
};

export default { MDWithDir: MdWithDir };
