interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  valueColor?: string;
}

export function StatCard({ title, value, description, icon, valueColor }: StatCardProps) {
  return (
    <div className="rounded-lg border border-zinc-900/80 bg-[#050505] p-5 transition-colors duration-150 ease-out hover:border-white/10">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <div className="rounded-md bg-[rgba(255,255,255,0.04)] p-1.5 text-zinc-400">
          {icon}
        </div>
      </div>
      <p
        className="mt-2 text-4xl font-bold tracking-tight text-white"
        style={{
          fontFamily: "var(--font-geist-mono)",
          ...(valueColor ? { color: valueColor } : {}),
        }}
      >
        {value}
      </p>
      {description && (
        <p className="mt-1 text-xs text-zinc-500">{description}</p>
      )}
    </div>
  );
}
