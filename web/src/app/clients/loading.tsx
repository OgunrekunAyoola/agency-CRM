export default function TableLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-slate-100 animate-pulse rounded" />
        <div className="h-10 w-32 bg-slate-100 animate-pulse rounded-lg" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 w-full bg-slate-100 animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}
