export default function Loading() {
  return (
    <div className="p-8">
      {/* PageHeader Skeleton */}
      <div className="pb-6 mb-8 border-b border-zinc-800">
        <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse mt-2"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="space-y-3">
        <div className="h-24 w-full bg-zinc-800/50 rounded animate-pulse"></div>
        <div className="h-24 w-full bg-zinc-800/50 rounded animate-pulse"></div>
        <div className="h-24 w-full bg-zinc-800/50 rounded animate-pulse"></div>
        <div className="h-24 w-full bg-zinc-800/50 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
