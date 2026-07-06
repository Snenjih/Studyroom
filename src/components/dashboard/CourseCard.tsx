import Link from 'next/link';

import { ProgressBar } from './ProgressBar';

interface CourseCardProps {
  courseId: string;
  title: string;
  programTitle: string;
  progressPercent: number;
}

export function CourseCard({ courseId, title, programTitle, progressPercent }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${courseId}/learn`}
      className="group relative block overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 p-5 transition-colors hover:border-cyan-500/40 hover:bg-zinc-900"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent transition-all duration-300 group-hover:via-cyan-500/60" />
      <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{programTitle}</p>
      <h3 className="mt-1 text-lg font-semibold text-zinc-100">{title}</h3>
      <div className="mt-4">
        <ProgressBar
          percent={progressPercent}
          label={progressPercent >= 100 ? 'Abgeschlossen' : 'Fortschritt'}
        />
      </div>
    </Link>
  );
}
