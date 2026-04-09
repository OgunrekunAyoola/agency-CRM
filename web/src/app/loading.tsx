export default function Loading() {
  return (
    <div className="flex flex-col space-y-8 animate-pulse p-4">
      {/* Skeleton for Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-96 bg-slate-100 rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
      </div>

      {/* Skeleton for Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-slate-100 rounded-xl border border-slate-200/50"></div>
        ))}
      </div>

      {/* Skeleton for Main Table Content */}
      <div className="space-y-4 border border-slate-200/50 rounded-xl overflow-hidden p-1">
        <div className="h-12 bg-slate-50 w-full mb-2"></div>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-16 w-full bg-slate-100/50 rounded-md"></div>
        ))}
      </div>
    </div>
  );
}
