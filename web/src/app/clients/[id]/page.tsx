'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useClientDashboard } from '@/hooks/queries/useClientDashboard';
import { Container } from '@/components/ui/LayoutPrimitives';
import {
  ArrowLeft,
  Building2,
  MapPin,
  AlertCircle,
  Loader2,
  FolderOpen,
  UserSearch,
  FileText,
  DollarSign,
  CheckCircle2,
  TrendingDown,
  BarChart3,
} from 'lucide-react';

// ── Stat card ─────────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function ClientDashboardPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { data, isLoading, error } = useClientDashboard(clientId);

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container>
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            {error instanceof Error && error.message.includes('404')
              ? 'Client not found or you do not have permission to view this client.'
              : 'Failed to load client dashboard. Please try again.'}
          </p>
        </div>
        <Link href="/clients" className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Clients
        </Link>
      </Container>
    );
  }

  const currency = (v: number) =>
    `$${v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <Container>
      {/* ── Breadcrumb ── */}
      <div className="mb-6">
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Clients
        </Link>
      </div>

      {/* ── Client Identity Block ── */}
      <div className="mb-8 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
            {data.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
            {data.legalName && (
              <p className="text-sm text-muted-foreground">{data.legalName}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
          {data.industry && (
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" /> {data.industry}
            </span>
          )}
          {data.businessAddress && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {data.businessAddress}
            </span>
          )}
        </div>
      </div>

      {/* ── Activity KPIs ── */}
      <section aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Activity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <KpiCard
            label="Active Projects"
            value={data.activeProjectsCount}
            icon={FolderOpen}
            color="bg-blue-100 text-blue-700"
          />
          <KpiCard
            label="Open Leads"
            value={data.openLeadsCount}
            icon={UserSearch}
            color="bg-amber-100 text-amber-700"
          />
          <KpiCard
            label="Pending Offers"
            value={data.pendingOffersCount}
            icon={FileText}
            color="bg-purple-100 text-purple-700"
          />
        </div>
      </section>

      {/* ── Financial KPIs ── */}
      <section aria-labelledby="financial-heading">
        <h2 id="financial-heading" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Financials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Invoiced"
            value={currency(data.totalInvoiced)}
            icon={DollarSign}
            color="bg-gray-100 text-gray-700"
          />
          <KpiCard
            label="Total Paid"
            value={currency(data.totalPaid)}
            icon={CheckCircle2}
            color="bg-emerald-100 text-emerald-700"
          />
          <KpiCard
            label="Outstanding"
            value={currency(data.totalOutstanding)}
            icon={TrendingDown}
            color={data.totalOutstanding > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}
          />
          <KpiCard
            label="Total Ad Spend"
            value={currency(data.totalAdSpend)}
            icon={BarChart3}
            color="bg-indigo-100 text-indigo-700"
          />
        </div>
      </section>
    </Container>
  );
}
