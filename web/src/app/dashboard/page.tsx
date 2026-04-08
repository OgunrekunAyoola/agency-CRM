'use client';

import { useStats } from '@/hooks/queries/useStats';
import { useInvoices, InvoiceStatus } from '@/hooks/queries/useInvoices';
import { useAdMetrics } from '@/hooks/queries/useAdMetrics';
import { Card, CardContent, CardHeader, CardTitle, Container, Section } from '@/components/ui/LayoutPrimitives';
import { ROIAnalytics } from './components/ROIAnalytics';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const { metrics, isLoading: metricsLoading } = useAdMetrics(); // Note: Without projectId, this might need a global endpoint or we just sum all

  const isLoading = statsLoading || invoicesLoading || metricsLoading;

  const totalRevenue = invoices
    .filter(i => i.status === InvoiceStatus.Paid)
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalAdSpend = metrics.reduce((sum, m) => sum + m.spend, 0);

  const statCards = [
    { title: 'Total Revenue (Paid)', value: `$${totalRevenue.toLocaleString()}`, color: 'text-emerald-600', link: '/invoices' },
    { title: 'Total Ad Spend', value: `$${totalAdSpend.toLocaleString()}`, color: 'text-rose-600', link: '/projects' },
    { title: 'Active Projects', value: stats?.projects ?? 0, color: 'text-blue-600', link: '/projects' },
    { title: 'Total Clients', value: stats?.clients ?? 0, color: 'text-indigo-600', link: '/clients' },
    { title: 'Active Leads', value: stats?.leads ?? 0, color: 'text-emerald-500', link: '/leads' },
    { title: 'Pending Offers', value: stats?.offers ?? 0, color: 'text-amber-600', link: '/offers' },
  ];

  if (isLoading) {
    return (
      <Container>
        <Section title="Dashboard Overview">
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse bg-muted h-32 text-transparent">
                Loading...
              </Card>
            ))}
          </div>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section title="Agency Performance">
        <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-4">
          <Card className="md:col-span-2 shadow-sm border-blue-100 bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-blue-600">Revenue Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex justify-between items-end mb-2">
                  <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Goal: $50,000</div>
               </div>
               <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-1000" 
                    style={{ width: `${Math.min((totalRevenue / 50000) * 100, 100)}%` }} 
                  />
               </div>
               <p className="mt-2 text-xs text-muted-foreground font-medium">
                  {Math.round((totalRevenue / 50000) * 100)}% of monthly target reached
               </p>
            </CardContent>
          </Card>

          {statCards.slice(0, 4).map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <a href={stat.link} className="block">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                </CardContent>
              </a>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="ROI & Performance Intelligence" className="mt-8">
         <ROIAnalytics />
      </Section>

      <Section title="Recent Activity" className="mt-8">
         <Card>
            <CardContent className="py-6">
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     <p className="text-sm">Revenue tracking is now active. Total paid: <span className="font-bold">${totalRevenue.toLocaleString()}</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-2 h-2 rounded-full bg-blue-500" />
                     <p className="text-sm">New project profitability insights enabled.</p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </Section>
    </Container>
  );
}
