import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-bold text-3xl text-white mb-8 shadow-xl animate-in zoom-in duration-500">
          A
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
          Agency <span className="text-indigo-600">CRM</span>
        </h1>
        
        <p className="max-w-2xl text-xl text-slate-600 mb-10 leading-relaxed">
          The ultimate command center for modern digital agencies. 
          Manage clients, projects, and revenue with precision and style.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-transform">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/clients">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold hover:bg-white hover:scale-[1.02] transition-transform">
              View Clients
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="font-bold text-lg">FAST</div>
          <div className="font-bold text-lg">SECURE</div>
          <div className="font-bold text-lg">MODERN</div>
          <div className="font-bold text-lg">SCALABLE</div>
        </div>
      </main>
      
      <footer className="py-10 border-t bg-white text-center text-slate-400 text-sm">
        © 2026 Agency CRM. Precision growth for digital agencies.
      </footer>
    </div>
  );
}
