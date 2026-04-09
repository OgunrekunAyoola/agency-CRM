import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mb-8 border border-rose-100">
        <svg className="w-12 h-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>

      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
        Page Not Found
      </h1>
      
      <p className="max-w-md text-lg text-slate-500 mb-10 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. 
        Don&apos;t worry, your data is safe!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/dashboard">
          <Button size="lg" className="px-8 shadow-lg shadow-indigo-100">
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/clients">
          <Button variant="outline" size="lg" className="px-8">
            View Clients
          </Button>
        </Link>
      </div>
    </div>
  );
}
