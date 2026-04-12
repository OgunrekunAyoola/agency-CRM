export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="h-12 bg-muted rounded" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-12 w-full bg-muted rounded" />
      ))}
    </div>
  );
}
