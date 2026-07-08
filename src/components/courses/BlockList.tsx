import { getCourseTypeModule } from '@/app-config';
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

  // Server-seitig aufgelöst (BlockList ist eine Server-Komponente) und als fertige
  // Komponenten-Referenz an die Client-Komponente BlockRow durchgereicht: BlockRow darf
  // `app-config.ts` selbst nicht importieren, da `ENABLED_MODULES` (T031) im
  // Client-Bundle nicht sichtbar ist (nur `NEXT_PUBLIC_*`-Vars sind es) — das führte
  // sonst zu einem Server/Client-Hydration-Mismatch, sobald ein Modul deaktiviert war.
  const registeredEditor = getCourseTypeModule(courseTypeKey)?.editor;

  return (
    <ul className="flex flex-col gap-3">
      {blocks.map((block, index) => (
        <BlockRow
          key={block.id}
          courseId={courseId}
          blockId={block.id}
          blockType={block.blockType}
          content={block.content as Record<string, unknown>}
          position={block.position}
          isFirst={index === 0}
          isLast={index === blocks.length - 1}
          fields={allowedBlockTypes.find((entry) => entry.type === block.blockType)?.fields}
          registeredEditor={registeredEditor}
        />
      ))}
    </ul>
  );
}
