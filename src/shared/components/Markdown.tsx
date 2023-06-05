import ReactMarkdown from "react-markdown";

import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import dark from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import { MarkdownProps } from "shared/types";
import "github-markdown-css/github-markdown-dark.css";

const Markdown = ({ children }: MarkdownProps) => {
  return (
    <ReactMarkdown
      children={children}
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      className="markdown-body"
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, "")}
              style={dark}
              language={match[1]}
              PreTag="div"
            />
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};

export default Markdown;
