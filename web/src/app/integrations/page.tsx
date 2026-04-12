'use client';

import { useState } from 'react';
import { Container, Section, Card, CardHeader, CardTitle, CardContent } from '@/components/ui/LayoutPrimitives';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { CheckCircle2, ExternalLink } from 'lucide-react';

interface Integration {
  name: string;
  description: string;
  webhookUrl: string;
  status: string;
  iconColor: string;
  setupSteps: string[];
  docsUrl: string;
}

export default function IntegrationsPage() {
  const webhookBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [configuring, setConfiguring] = useState<Integration | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      // Fallback for non-https contexts
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    toast.success('Webhook URL copied to clipboard');
  };

  const integrations: Integration[] = [
    {
      name: 'Meta Ads (Facebook/Instagram)',
      description: 'Ingest leads directly from Meta Lead Ads in real-time.',
      webhookUrl: `${webhookBaseUrl}/api/webhooks/meta/lead`,
      status: 'Ready',
      iconColor: 'bg-blue-600',
      docsUrl: 'https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving/',
      setupSteps: [
        'Go to your Meta Business Suite → All Tools → Leads Centre.',
        'Select the Lead Form you want to connect.',
        'Under "Webhooks", click "Add Webhook Subscription".',
        'Paste the webhook URL below into the "Callback URL" field.',
        'Set the Verify Token to your API secret key (contact your admin).',
        'Click "Verify and Save" — Meta will send a verification ping.',
        'Test by submitting a lead on your page — it should appear in Leads within seconds.',
      ],
    },
    {
      name: 'Google Ads',
      description: 'Track spend and performance metrics natively.',
      webhookUrl: `${webhookBaseUrl}/api/webhooks/google/performance`,
      status: 'Ready',
      iconColor: 'bg-red-500',
      docsUrl: 'https://developers.google.com/google-ads/api/docs/start',
      setupSteps: [
        'Open Google Ads → Tools & Settings → Linked accounts.',
        'Select "Google Analytics" or "Tag Manager" as the connection method.',
        'In your Google Tag Manager, add a new "Webhook" trigger.',
        'Paste the webhook URL below as the endpoint.',
        'Configure the trigger to fire on conversion events (purchases, form fills).',
        'Publish your container and verify in the Network tab that POST requests are sent to this URL.',
      ],
    },
    {
      name: 'TikTok Ads',
      description: 'Automated performance reporting for TikTok campaigns.',
      webhookUrl: `${webhookBaseUrl}/api/webhooks/tiktok/performance`,
      status: 'Ready',
      iconColor: 'bg-black',
      docsUrl: 'https://ads.tiktok.com/marketing_api/docs?id=1701890979375106',
      setupSteps: [
        'Log in to TikTok Ads Manager → Tools → Events.',
        'Click "Web Events" → "Set Up Web Events".',
        'Choose "Events API" as the connection method.',
        'In the Events API section, set the Pixel ID and paste the webhook URL below.',
        'Map your conversion events (Add to Cart, Purchase, Lead) to the webhook.',
        'Use the "Test Events" tool in TikTok to confirm the connection is live.',
      ],
    },
  ];

  return (
    <Container>
      <Section className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Integrations &amp; Webhooks</h1>
      </Section>

      <Section>
        <div className="grid gap-6">
          {integrations.map((app) => (
            <Card key={app.name} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className={`w-full md:w-2 ${app.iconColor}`} />
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{app.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{app.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        {app.status}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfiguring(app)}
                        id={`configure-${app.name.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <label className="text-xs font-bold uppercase text-slate-500 block mb-2">
                      Native Webhook URL
                    </label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-white p-2 rounded border truncate">
                        {app.webhookUrl}
                      </code>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(app.webhookUrl)}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Paste this URL into your {app.name.split(' ')[0]} Developer Dashboard to
                      enable automatic ingestion.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="API Analytics Infrastructure" className="mt-8">
        <Card className="bg-slate-900 text-white">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center gap-8 px-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Powering Agency Intelligence</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  These native connectors feed directly into our ROI calculation engine. By
                  bridging the gap between ad spend and legal contracts, we provide real-time Cost
                  Per Lead (CPL) and Return on Ad Spend (ROAS) analytics.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center font-bold text-2xl">A</div>
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center font-bold text-2xl">I</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Configure modal */}
      {configuring && (
        <Modal
          isOpen={!!configuring}
          onClose={() => setConfiguring(null)}
          title={`Configure ${configuring.name}`}
          className="max-w-xl"
        >
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Follow these steps to connect {configuring.name} to your Agency CRM webhook.
            </p>

            {/* Numbered setup steps */}
            <ol className="space-y-3">
              {configuring.setupSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-foreground">{step}</span>
                </li>
              ))}
            </ol>

            {/* Webhook URL callout */}
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-xs font-bold uppercase text-muted-foreground">Your Webhook URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background p-2 rounded border truncate">
                  {configuring.webhookUrl}
                </code>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => copyToClipboard(configuring.webhookUrl)}
                >
                  Copy
                </Button>
              </div>
            </div>

            {/* Docs link */}
            <div className="flex items-center justify-between pt-2 border-t">
              <a
                href={configuring.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Official {configuring.name.split(' ')[0]} Documentation
              </a>
              <Button
                onClick={() => {
                  setConfiguring(null);
                  toast.success(`${configuring.name} configuration saved`);
                }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Container>
  );
}
