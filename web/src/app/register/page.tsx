'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/LayoutPrimitives';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    agencyName: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await register(formData);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-slate-200">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Join the Elite
          </h1>
          <p className="text-lg text-slate-600">
            Scale your agency with the ultimate operating system.
          </p>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Start your free 14-day trial today. No credit card required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Full Name"
                name="fullName"
                placeholder="Jane Cooper"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="bg-slate-50 border-slate-200"
              />
              <Input
                label="Agency Name"
                name="agencyName"
                placeholder="Acme Growth Partners"
                value={formData.agencyName}
                onChange={handleChange}
                required
                className="bg-slate-50 border-slate-200"
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
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-slate-50 border-slate-200"
              />
              {error && (
                <div className="p-4 text-sm rounded-lg bg-rose-50 text-rose-600 border border-rose-100 animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full h-11 text-base font-semibold transition-all shadow-lg shadow-blue-500/20" isLoading={isSubmitting}>
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
