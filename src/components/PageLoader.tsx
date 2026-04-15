export default function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-sable" />
          <div className="absolute inset-0 rounded-full border-4 border-ocre border-t-transparent animate-spin" />
        </div>
        <p className="font-body text-sm text-gris-chaud animate-pulse">Chargement…</p>
      </div>
    </div>
  );
}
