'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/LayoutPrimitives';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, completeOnboarding } = useAuth();

  const [formData, setFormData] = useState({
    jobTitle: '',
    phoneNumber: '',
    industry: '',
    companySize: '',
    website: '',
    targetMonthlyRevenue: 0,
    businessAddress: '',
    brandColor: '#3b82f6', // Default blue
    logoUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'targetMonthlyRevenue' ? parseFloat(value) : value 
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding(formData);
    } catch (err) {
      console.error('Onboarding failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8 flex justify-between items-center px-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
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
              {s < 4 && (
                <div
                  className={`w-16 h-1 mx-2 rounded ${
                    step > s ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-blue-600" />
          
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Tell us about yourself</CardTitle>
                <CardDescription>We&apos;ll use this to set up your personal workspace profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Job Title"
                    name="jobTitle"
                    placeholder="CEO / Founder"
                    value={formData.jobTitle}
                    onChange={handleChange}
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

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Your Agency Details</CardTitle>
                <CardDescription>Help us tailor the experience to your business model.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium mb-1.5">Industry</label>
                        <select 
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                          <option value="">Select Industry</option>
                          <option value="SaaS">SaaS Marketing</option>
                          <option value="eCommerce">E-commerce</option>
                          <option value="Creative">Creative & Content</option>
                          <option value="FullService">Full Service Digital</option>
                        </select>
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
                    value={formData.targetMonthlyRevenue.toString()}
                    onChange={handleChange}
                  />
                   <Input
                    label="Business Address"
                    name="businessAddress"
                    placeholder="123 Agency Way, suite 100"
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

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl">Branding & Identity</CardTitle>
                <CardDescription>Customize the look and feel of your workspace.</CardDescription>
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
                        />
                        <div className="flex-1 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                          <p className="text-xs text-slate-500">This color will be used for buttons, links and charts in your dashboard.</p>
                        </div>
                      </div>
                   </div>
                   <Input
                    label="Logo Image URL"
                    name="logoUrl"
                    placeholder="https://link-to-your-logo.png"
                    value={formData.logoUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={prevStep}>Back</Button>
                  <Button onClick={nextStep} className="px-8" disabled={!formData.logoUrl}>Final Review</Button>
                </div>
              </CardContent>
            </>
          )}

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
                <div className="p-4 bg-slate-50 rounded-lg text-left inline-block w-full max-w-sm border border-slate-200">
                   <p className="text-sm font-medium text-slate-500 mb-1">AGENCY</p>
                   <p className="font-bold text-lg">{formData.industry} Agency</p>
                   <p className="text-sm text-slate-600">{formData.website}</p>
                   <div className="mt-4 flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: formData.brandColor }} />
                      <span className="text-sm font-mono">{formData.brandColor}</span>
                   </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={handleSubmit} className="w-full h-12 text-lg shadow-xl shadow-blue-500/20" isLoading={isSubmitting}>
                    Enter Workspace
                  </Button>
                  <Button variant="ghost" onClick={prevStep}>Make Changes</Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
