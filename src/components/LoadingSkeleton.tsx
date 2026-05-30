export function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 animate-pulse h-full">
      <div className="aspect-[2/3] bg-zinc-800 w-full" />
      <div className="p-3 space-y-2 flex-grow">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-1/2" />
        <div className="pt-2 flex justify-between">
          <div className="h-5 bg-zinc-800 rounded w-1/3" />
          <div className="h-5 bg-zinc-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-900" />
      <div className="absolute bottom-0 left-0 p-6 sm:p-10 space-y-4 max-w-lg">
        <div className="h-6 bg-zinc-800 rounded w-1/3" />
        <div className="h-10 bg-zinc-800 rounded w-full" />
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="aspect-[2/3] bg-zinc-900 border border-zinc-800 rounded-2xl md:col-span-1" />
        <div className="space-y-4 md:col-span-2 py-4">
          <div className="h-8 bg-zinc-900 rounded w-2/3" />
          <div className="h-5 bg-zinc-900 rounded w-1/3" />
          <hr className="border-zinc-800 my-4" />
          <div className="space-y-2">
            <div className="h-4 bg-zinc-900 rounded" />
            <div className="h-4 bg-zinc-900 rounded" />
            <div className="h-4 bg-zinc-900 rounded w-5/6" />
          </div>
          <div className="pt-6 flex flex-wrap gap-4">
            <div className="h-11 bg-zinc-900 rounded-xl w-36" />
            <div className="h-11 bg-zinc-900 rounded-xl w-40" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-6 bg-zinc-900 rounded w-1/4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-12 bg-zinc-900 rounded-xl border border-zinc-800" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-wrap gap-3 animate-pulse">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="h-9 bg-zinc-900 rounded-full w-24 border border-zinc-800" />
      ))}
    </div>
  );
}

export default function LoadingSkeleton({ type = 'grid', count = 10 }: { type?: 'grid' | 'banner' | 'detail' | 'category'; count?: number }) {
  if (type === 'banner') return <BannerSkeleton />;
  if (type === 'detail') return <DetailSkeleton />;
  if (type === 'category') return <CategorySkeleton />;
  return <GridSkeleton count={count} />;
}
