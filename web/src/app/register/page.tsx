'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/LayoutPrimitives';
import Link from 'next/link';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-rose-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    agencyName: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!formData.agencyName.trim()) errors.agencyName = 'Agency name is required.';
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    } else if (strength.score < 3) {
      errors.password = 'Too weak — add uppercase letters, numbers, or symbols.';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await register(formData.email, formData.password, formData.fullName, formData.agencyName);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-slate-200">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Join the Elite</h1>
          <p className="text-lg text-slate-600">Scale your agency with the ultimate operating system.</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Start your free 14-day trial today. No credit card required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4" noValidate>
              <Input
                label="Full Name"
                name="fullName"
                placeholder="Jane Cooper"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="bg-slate-50 border-slate-200"
                error={fieldErrors.fullName}
              />
              <Input
                label="Agency Name"
                name="agencyName"
                placeholder="Acme Growth Partners"
                value={formData.agencyName}
                onChange={handleChange}
                required
                className="bg-slate-50 border-slate-200"
                error={fieldErrors.agencyName}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="jane@agency.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-slate-50 border-slate-200"
                error={fieldErrors.email}
              />
              <div className="space-y-1">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-slate-50 border-slate-200"
                  error={fieldErrors.password}
                />
                {formData.password.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= strength.score ? strength.color : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${strength.score <= 2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {strength.label} password
                    </p>
                  </div>
                )}
              </div>
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-slate-50 border-slate-200"
                error={fieldErrors.confirmPassword}
              />
              {error && (
                <div role="alert" className="p-4 text-sm rounded-lg bg-rose-50 text-rose-600 border border-rose-100 animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold transition-all shadow-lg shadow-blue-500/20"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Create Agency Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              Already using Agency CRM?{' '}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
