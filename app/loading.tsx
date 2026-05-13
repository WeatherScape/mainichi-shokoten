export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="space-y-4">
        <div className="h-4 w-32 animate-pulse bg-line" />
        <div className="h-12 w-2/3 max-w-lg animate-pulse bg-line" />
        <div className="h-4 w-full max-w-xl animate-pulse bg-line" />
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border border-line bg-wall p-4 shadow-paper">
            <div className="aspect-[4/5] animate-pulse bg-line/70" />
            <div className="mt-4 h-4 w-2/3 animate-pulse bg-line" />
          </div>
        ))}
      </div>
    </main>
  );
}
