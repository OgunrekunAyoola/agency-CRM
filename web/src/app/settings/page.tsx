'use client';

import { Container, Section } from '@/components/ui/LayoutPrimitives';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Building2, CreditCard, Zap, Link as LinkIcon, AlertTriangle, Info, KeyRound } from 'lucide-react';
import { useSettings } from '@/hooks/queries/useSettings';
import { ErrorState } from '@/components/ui/StateVisuals';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { settings, isLoading, isBackendMissing, updateSettings, isSaving } = useSettings();

  // Local form state — seeded from the API (or defaults if API isn't available)
  const [form, setForm] = useState(settings);

  // When API data loads, seed the form
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isLoading) setForm(settings);
  }, [isLoading, settings]);

  // Change password state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [isSavingPw, setIsSavingPw] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateSettings(form);
      toast.success('Settings updated successfully');
    } catch {
      toast.error('Failed to save settings. Please try again.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!pwForm.currentPassword) errors.currentPassword = 'Current password is required.';
    if (!pwForm.newPassword || pwForm.newPassword.length < 8) errors.newPassword = 'New password must be at least 8 characters.';
    if (pwForm.newPassword !== pwForm.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    if (Object.keys(errors).length > 0) { setPwErrors(errors); return; }

    setIsSavingPw(true);
    try {
      await api.post('/api/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwErrors({});
    } catch {
      toast.error('Failed to change password. Check that your current password is correct.');
    } finally {
      setIsSavingPw(false);
    }
  };

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Container className="pb-20">
      <Section className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0" aria-label="Back to dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your agency profile and global preferences.</p>
        </div>
      </Section>

      {/* Backend-not-yet-available banner */}
      {isBackendMissing && (
        <div className="flex items-start gap-3 p-4 mb-8 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">Settings API not yet available</p>
            <p className="text-sm mt-1">
              The backend <code className="font-mono text-xs">/api/settings</code> endpoint hasn&apos;t been
              implemented yet. You can edit the form below, but changes will not be persisted until
              the backend is deployed.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <nav aria-label="Settings sections" className="space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-2 bg-slate-100 border-l-4 border-l-blue-600">
            <Building2 className="h-4 w-4" /> Agency Profile
          </Button>
          <Link href="/settings/automation">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Zap className="h-4 w-4" /> Automation Engine
            </Button>
          </Link>
          <Link href="/integrations">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LinkIcon className="h-4 w-4" /> Channel Integrations
            </Button>
          </Link>
        </nav>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-40 bg-muted rounded-xl" />
              <div className="h-32 bg-muted rounded-xl" />
            </div>
          ) : !settings && !isBackendMissing ? (
            <ErrorState reset={() => window.location.reload()} />
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Agency Profile */}
              <Section className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Business Identity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Legal Agency Name"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                  <Input
                    label="VAT / Tax ID"
                    value={form.taxId}
                    onChange={(e) => update('taxId', e.target.value)}
                  />
                  <Input
                    label="Billing Email"
                    type="email"
                    value={form.billingEmail}
                    onChange={(e) => update('billingEmail', e.target.value)}
                    className="md:col-span-2"
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Business Address"
                      value={form.address}
                      onChange={(e) => update('address', e.target.value)}
                    />
                  </div>
                </div>
              </Section>

              {/* Billing & Finance */}
              <Section className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  Billing &amp; Finance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="currency-select" className="text-sm font-medium">Global Currency</label>
                    <select
                      id="currency-select"
                      className="w-full h-10 border rounded-md px-3 py-2 bg-background text-sm
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={form.currency}
                      onChange={(e) => update('currency', e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="NGN">NGN (₦)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <input
                      type="checkbox"
                      id="autoInvoice"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                      checked={form.autoInvoice}
                      onChange={(e) => update('autoInvoice', e.target.checked)}
                    />
                    <label htmlFor="autoInvoice" className="text-sm font-medium leading-none">
                      Enable Automated Monthly Billing
                    </label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4 italic flex items-center gap-1">
                  <Info className="h-3 w-3 shrink-0" />
                  Automated billing generates draft invoices on contract anniversary dates.
                </p>
              </Section>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  aria-busy={isSaving}
                  className="px-8 bg-blue-600 hover:bg-blue-700"
                  disabled={isBackendMissing}
                  title={isBackendMissing ? 'Settings API not yet available' : undefined}
                >
                  {isBackendMissing ? 'Save (API Unavailable)' : 'Save All Changes'}
                </Button>
              </div>
            </form>
          )}

          {/* Change Password — always visible, independent of backend missing state */}
          <form onSubmit={handleChangePassword} className="space-y-6" noValidate>
            <Section className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-rose-600" />
                Change Password
              </h2>
              <div className="space-y-4 max-w-sm">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={pwForm.currentPassword}
                  onChange={(e) => { setPwForm(p => ({ ...p, currentPassword: e.target.value })); if (pwErrors.currentPassword) setPwErrors(p => ({ ...p, currentPassword: '' })); }}
                  required
                  error={pwErrors.currentPassword}
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={pwForm.newPassword}
                  onChange={(e) => { setPwForm(p => ({ ...p, newPassword: e.target.value })); if (pwErrors.newPassword) setPwErrors(p => ({ ...p, newPassword: '' })); }}
                  required
                  error={pwErrors.newPassword}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={pwForm.confirmPassword}
                  onChange={(e) => { setPwForm(p => ({ ...p, confirmPassword: e.target.value })); if (pwErrors.confirmPassword) setPwErrors(p => ({ ...p, confirmPassword: '' })); }}
                  required
                  error={pwErrors.confirmPassword}
                />
              </div>
              <div className="flex justify-start pt-4">
                <Button
                  type="submit"
                  isLoading={isSavingPw}
                  disabled={isSavingPw}
                  variant="secondary"
                  className="px-6"
                >
                  Update Password
                </Button>
              </div>
            </Section>
          </form>
        </div>
      </div>
    </Container>
  );
}
