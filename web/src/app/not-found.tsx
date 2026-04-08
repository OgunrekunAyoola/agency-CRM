import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-5xl font-black text-slate-300">404</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or may have been moved.
        Check the URL or head back to your dashboard.
      </p>
      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/clients"
          className="px-5 py-2.5 bg-white border text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
        >
          View Clients
        </Link>
      </div>
    </div>
  );
}
