import type { BlockTypeDefinition } from '@/lib/schema-definition/types';

import { BlockRow } from './BlockRow';

interface BlockListItem {
  id: string;
  blockType: string;
  content: unknown;
  position: number;
}

interface BlockListProps {
  courseId: string;
  courseTypeKey: string;
  allowedBlockTypes: BlockTypeDefinition[];
  blocks: BlockListItem[];
}

export function BlockList({ courseId, courseTypeKey, allowedBlockTypes, blocks }: BlockListProps) {
  if (blocks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-10 text-center">
        <p className="text-zinc-300">Noch keine Blöcke — füge den ersten Block hinzu</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {blocks.map((block, index) => (
        <BlockRow
          key={block.id}
          courseId={courseId}
          courseTypeKey={courseTypeKey}
          blockId={block.id}
          blockType={block.blockType}
          content={block.content as Record<string, unknown>}
          position={block.position}
          isFirst={index === 0}
          isLast={index === blocks.length - 1}
          fields={allowedBlockTypes.find((entry) => entry.type === block.blockType)?.fields}
        />
      ))}
    </ul>
  );
}
