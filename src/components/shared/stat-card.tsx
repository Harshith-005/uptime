interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  valueColor?: string;
}

export function StatCard({ title, value, description, icon, valueColor }: StatCardProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-150 ease-out hover:border-[var(--text-muted)]/30">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--text-muted)]">{title}</p>
        <div className="rounded-md bg-[var(--border)]/30 p-1.5 text-[var(--text-muted)]">
          {icon}
        </div>
      </div>
      <p
        className="mt-2 text-4xl font-bold tracking-tight text-[var(--text-primary)]"
        style={{
          fontFamily: "var(--font-geist-mono)",
          ...(valueColor ? { color: valueColor } : {}),
        }}
      >
        {value}
      </p>
      {description && (
        <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>
      )}
    </div>
  );
}
