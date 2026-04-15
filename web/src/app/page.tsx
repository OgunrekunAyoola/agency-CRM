import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Agency CRM — Precision Growth for Digital Agencies',
  description:
    'All-in-one CRM built for digital agencies. Manage leads, offers, contracts, invoices, and ad performance from one command center.',
};

const FEATURES = [
  {
    icon: '🎯',
    title: 'Lead Pipeline',
    description:
      'Capture leads from Meta, Google, and TikTok ads automatically. Move prospects through your sales funnel with a visual Kanban board.',
  },
  {
    icon: '📄',
    title: 'Proposals & Contracts',
    description:
      'Send branded offers and get contracts signed digitally — no third-party tools needed. Track every status from draft to signed.',
  },
  {
    icon: '💰',
    title: 'Invoice & Billing',
    description:
      'Generate invoices from contracts in one click. Automated monthly billing, partial payments, and overdue reminders built in.',
  },
  {
    icon: '📊',
    title: 'ROI Analytics',
    description:
      'Connect ad accounts and track spend, ROAS, CPL, and conversion rates per project. Real data — no spreadsheets.',
  },
  {
    icon: '🏗️',
    title: 'Project Management',
    description:
      'Track deliverables, log time, and manage your team across every client engagement with Gantt charts and task boards.',
  },
  {
    icon: '⚡',
    title: 'Automation Engine',
    description:
      'Schedule recurring billing, sync ad metrics, and send reminders automatically. Focus on work, not admin.',
  },
];

const STATS = [
  { value: '100%', label: 'Lead-to-invoice in one system' },
  { value: '<15s', label: 'To generate a signed contract' },
  { value: '3×', label: 'Faster month-end close' },
  { value: '0', label: 'Third-party tools needed' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Top Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-slate-900">Agency CRM</span>
          </Link>

          {/* Auth CTAs */}
          <nav className="flex items-center gap-3" aria-label="Site navigation">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-lg shadow-sm"
            >
              Start free trial
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-20 pb-28 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide mb-6">
              ✦ Built exclusively for digital agencies
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.08]">
              From first lead to{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                final invoice
              </span>
              , in one place.
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 leading-relaxed">
              Agency CRM connects your pipeline, contracts, projects, and billing — so you
              spend less time on admin and more time on results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center h-14 px-8 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all"
              >
                Start your free trial →
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-14 px-8 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                Sign in to your account
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-400">No credit card required · 14-day free trial</p>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="border-y border-slate-100 bg-slate-50 py-10 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-extrabold text-indigo-600 mb-1">{value}</div>
                <div className="text-sm text-slate-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                Everything your agency needs
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                One platform for every stage of client work — from the first ad click to the final payment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(({ icon, title, description }) => (
                <div
                  key={title}
                  className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all"
                >
                  <div className="text-3xl mb-4">{icon}</div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to run a tighter agency?
            </h2>
            <p className="text-indigo-200 text-lg mb-8">
              Join agencies who manage every client from lead to invoice in one system.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center h-14 px-10 text-base font-bold text-indigo-700 bg-white hover:bg-slate-50 rounded-xl shadow-lg hover:scale-[1.02] transition-all"
            >
              Create your free account
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="py-10 border-t bg-white px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-slate-700 text-sm">Agency CRM</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 Agency CRM. Precision growth for digital agencies.</p>
          <div className="flex gap-4 text-sm">
            <Link href="/login" className="text-slate-500 hover:text-slate-800 transition-colors">Log in</Link>
            <Link href="/signup" className="text-slate-500 hover:text-slate-800 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
