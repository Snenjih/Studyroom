import Markdown from 'react-markdown';

import type { MarkdownBlockContent } from '@/db/schema/content-blocks';

interface MarkdownBlockProps {
  content: MarkdownBlockContent | Record<string, unknown>;
}

export function MarkdownBlock({ content }: MarkdownBlockProps) {
  const text = typeof content?.content === 'string' ? content.content : '';

  if (!text.trim()) {
    return <p className="text-sm italic text-zinc-600">Dieser Block ist noch leer.</p>;
  }

  return (
    <div
      className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:text-zinc-100
        prose-p:leading-relaxed prose-p:text-zinc-300 prose-a:text-cyan-400 prose-a:no-underline
        hover:prose-a:underline prose-strong:text-zinc-100 prose-code:rounded prose-code:bg-zinc-900
        prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-300 prose-code:before:content-none
        prose-code:after:content-none prose-pre:border prose-pre:border-zinc-800 prose-pre:bg-zinc-950
        prose-blockquote:border-cyan-500/40 prose-blockquote:text-zinc-400 prose-li:text-zinc-300"
    >
      <Markdown>{text}</Markdown>
    </div>
  );
}
