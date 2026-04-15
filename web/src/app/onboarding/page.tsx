'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/LayoutPrimitives';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const router = useRouter();

  // Redirect away if the user has already completed onboarding.
  useEffect(() => {
    if (user?.isOnboarded) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const [formData, setFormData] = useState({
    jobTitle: '',
    phoneNumber: '',
    industry: '',
    companySize: '',
    website: '',
    targetMonthlyRevenue: 0,
    businessAddress: '',
    brandColor: '#3b82f6',
    logoUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetMonthlyRevenue' ? parseFloat(value) || 0 : value,
    }));
    if (stepErrors[name]) setStepErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (s: number): boolean => {
    const errors: Record<string, string> = {};
    if (s === 1) {
      if (!formData.jobTitle.trim()) errors.jobTitle = 'Job title is required.';
    }
    if (s === 2) {
      if (!formData.industry) errors.industry = 'Please select an industry.';
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(prev => prev + 1);
  };
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/api/auth/onboarding/complete', formData);
      toast.success('Welcome aboard! Your agency is set up.');
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const STEPS = ['About You', 'Agency Details', 'Branding', 'Launch'];

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8 flex justify-between items-center px-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step === s
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : step > s
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                <span className="text-xs text-slate-500 hidden sm:block">{STEPS[s - 1]}</span>
              </div>
              {s < 4 && (
                <div className={`w-12 sm:w-20 h-1 mx-2 rounded ${step > s ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" style={{ width: `${(step / 4) * 100}%`, transition: 'width 0.4s ease' }} />

          {/* Step 1: About You */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Tell us about yourself</CardTitle>
                <CardDescription>We&apos;ll use this to set up your personal workspace profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Job Title"
                    name="jobTitle"
                    placeholder="CEO / Founder"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    error={stepErrors.jobTitle}
                  />
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={nextStep} className="px-8">Continue</Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Agency Details */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Your Agency Details</CardTitle>
                <CardDescription>Help us tailor the experience to your business model.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">
                        Industry <span className="text-destructive">*</span>
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className={`w-full h-10 px-3 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          stepErrors.industry ? 'border-destructive' : 'border-input'
                        }`}
                      >
                        <option value="">Select Industry</option>
                        <option value="SaaS">SaaS Marketing</option>
                        <option value="eCommerce">E-commerce</option>
                        <option value="Creative">Creative &amp; Content</option>
                        <option value="FullService">Full Service Digital</option>
                      </select>
                      {stepErrors.industry && (
                        <p className="text-sm text-destructive" role="alert">{stepErrors.industry}</p>
                      )}
                    </div>
                    <Input
                      label="Agency Website"
                      name="website"
                      placeholder="https://agency.com"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                  <Input
                    label="Target Monthly Revenue ($)"
                    name="targetMonthlyRevenue"
                    type="number"
                    placeholder="50000"
                    value={formData.targetMonthlyRevenue || ''}
                    onChange={handleChange}
                  />
                  <Input
                    label="Business Address"
                    name="businessAddress"
                    placeholder="123 Agency Way, Suite 100"
                    value={formData.businessAddress}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={prevStep}>Back</Button>
                  <Button onClick={nextStep} className="px-8">Continue</Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Branding (logo is optional) */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Branding &amp; Identity</CardTitle>
                <CardDescription>Customize the look and feel of your workspace. You can update this any time in Settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Brand Application Color</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        name="brandColor"
                        value={formData.brandColor}
                        onChange={handleChange}
                        className="w-16 h-16 rounded-lg cursor-pointer border-4 border-white shadow-md"
                        aria-label="Pick brand color"
                      />
                      <div className="flex-1 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <p className="text-xs text-slate-500">Used for buttons, links, and charts across your dashboard.</p>
                        <p className="text-xs font-mono text-slate-400 mt-1">{formData.brandColor}</p>
                      </div>
                    </div>
                  </div>
                  <Input
                    label="Logo Image URL (optional)"
                    name="logoUrl"
                    placeholder="https://link-to-your-logo.png"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    helperText="You can add or update your logo later in Settings."
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={prevStep}>Back</Button>
                  <Button onClick={nextStep} className="px-8">Final Review</Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <>
              <CardHeader className="text-center pt-8">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  🚀
                </div>
                <CardTitle className="text-3xl">Ready for Launch!</CardTitle>
                <CardDescription>Everything is set. Your agency workspace is ready.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 text-center pb-12">
                <div className="p-4 bg-slate-50 rounded-lg text-left inline-block w-full max-w-sm border border-slate-200 space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agency</p>
                    <p className="font-bold text-base text-slate-900">{user.fullName}</p>
                  </div>
                  {formData.industry && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Industry</p>
                      <p className="text-sm text-slate-700">{formData.industry}</p>
                    </div>
                  )}
                  {formData.website && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Website</p>
                      <p className="text-sm text-slate-700">{formData.website}</p>
                    </div>
                  )}
                  <div className="pt-2 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border border-slate-200" style={{ backgroundColor: formData.brandColor }} />
                    <span className="text-xs font-mono text-slate-500">{formData.brandColor}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleSubmit}
                    className="w-full h-12 text-lg shadow-xl shadow-blue-500/20"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Enter Workspace
                  </Button>
                  <Button variant="ghost" onClick={prevStep} disabled={isSubmitting}>
                    Make Changes
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
