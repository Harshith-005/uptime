interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between border-b border-zinc-800 pb-6">
      <div>
        <h1
          className="text-2xl font-semibold text-white"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {title}
        </h1>
        {description && (
          <div className="mt-1 text-sm text-zinc-500">{description}</div>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
