'use client';

import { useParams, useRouter } from 'next/navigation';
import { useClient, PriorityTier } from '@/hooks/queries/useClients';
import { useProjects } from '@/hooks/queries/useProjects';
import { useInvoices } from '@/hooks/queries/useInvoices';
import { Button } from '@/components/ui/Button';
import { Container, Section, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/LayoutPrimitives';
import { PageError } from '@/components/ui/PageError';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';
import Link from 'next/link';

export default function ClientDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const { data: client, isLoading: clientLoading, isError: clientError } = useClient(id);
  const { projects, isLoading: projectsLoading } = useProjects();
  const { invoices, isLoading: invoicesLoading } = useInvoices();

  const isLoading = clientLoading || projectsLoading || invoicesLoading;

  if (clientError) {
    return (
      <ProtectedRoute>
        <Container>
          <PageError 
            title="Client profile failed to load"
            message="We couldn't retrieve the details for this client. They may have been removed."
          />
        </Container>
      </ProtectedRoute>
    );
  }

  if (isLoading || !client) {
    return (
      <ProtectedRoute>
        <Container>
          <div className="animate-pulse space-y-8">
            <div className="h-12 w-64 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-32 bg-slate-100 rounded-xl"></div>
                <div className="h-32 bg-slate-100 rounded-xl"></div>
                <div className="h-32 bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        </Container>
      </ProtectedRoute>
    );
  }

  // Filter projects and invoices for this client
  const clientProjects = projects.filter(p => p.clientId === id);
  const clientProjectIds = new Set(clientProjects.map(p => p.id));
  const clientInvoices = invoices.filter(i => clientProjectIds.has(i.projectId));
  const totalInvoiced = clientInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <ProtectedRoute>
      <Container>
        <Section className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{client.name}</h1>
            <p className="text-slate-500 font-medium">{client.legalName || 'No legal entity defined'}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()}>Back</Button>
            <Button>Edit Profile</Button>
          </div>
        </Section>

        <Section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{clientProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">${totalInvoiced.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">Priority Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${
                  client.priority === PriorityTier.Tier1 ? 'bg-purple-100 text-purple-700' :
                  client.priority === PriorityTier.Tier2 ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
              }`}>
                  {PriorityTier[client.priority]}
              </span>
            </CardContent>
          </Card>
        </Section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <Section title="Active Projects">
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project Name</TableHead>
                                <TableHead className="text-right">Project Page</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientProjects.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium underline decoration-slate-200">
                                        <Link href={`/projects/${p.id}`}>{p.name}</Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/projects/${p.id}`}>
                                            <Button size="sm" variant="ghost">View Details</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {clientProjects.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center py-8 text-slate-400">No projects found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </Section>

            <Section title="Recent Invoices">
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientInvoices.slice(0, 5).map(i => (
                                <TableRow key={i.id}>
                                    <TableCell className="font-medium">{i.invoiceNumber}</TableCell>
                                    <TableCell className="text-right font-bold text-emerald-600">${i.totalAmount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                            {clientInvoices.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center py-8 text-slate-400">No invoices yet</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </Section>
        </div>

        <Section className="mt-12">
            <Card className="bg-slate-900 border-none text-white overflow-hidden relative">
                <CardHeader>
                    <CardTitle className="text-lg">Business Metadata</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-8">
                    <div>
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Industry</div>
                        <div className="font-medium">{client.industry || 'Unknown'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Vat Number</div>
                        <div className="font-mono font-medium">{client.vatNumber || 'Individual / Non-VAT'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Office Address</div>
                        <div className="text-sm text-slate-300">{client.businessAddress || 'No address provided'}</div>
                    </div>
                </CardContent>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full pointer-events-none" />
            </Card>
        </Section>
      </Container>
    </ProtectedRoute>
  );
}
