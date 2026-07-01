interface ProgressBarProps {
  percent: number;
  label?: string;
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));

  return (
    <div className="w-full">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between font-mono text-[11px] text-zinc-500">
        <span>{label}</span>
        <span className="text-zinc-400">{clamped}%</span>
      </div>
    </div>
  );
}
