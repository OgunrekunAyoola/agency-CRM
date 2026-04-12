export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3].map((col) => (
          <div key={col} className="space-y-3">
            <div className="h-6 w-24 bg-muted rounded" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
