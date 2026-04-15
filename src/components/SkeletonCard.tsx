export default function SkeletonCard() {
  return (
    <div className="bg-blanc-casse rounded-card shadow-card overflow-hidden animate-pulse">
      <div className="aspect-square bg-sable" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-sable rounded w-4/5" />
        <div className="h-4 bg-sable rounded w-3/5" />
        <div className="h-5 bg-sable/70 rounded w-1/3 mt-1" />
      </div>
    </div>
  );
}
