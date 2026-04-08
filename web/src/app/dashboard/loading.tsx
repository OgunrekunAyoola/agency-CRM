export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 bg-slate-100 animate-pulse rounded-xl" />
        <div className="h-64 bg-slate-100 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
