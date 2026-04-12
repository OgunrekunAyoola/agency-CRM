import React from 'react';
import { 
  AlertTriangle, 
  Lock, 
  Clock, 
  CheckCircle2, 
  FileQuestion, 
  RefreshCw, 
  Home, 
  LogIn,
  ArrowRight,
  LucideIcon
} from 'lucide-react';
import Link from 'next/link';

interface StateProps {
  title: string;
  description: string;
  cta?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
  secondaryCta?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
}

/**
 * Base status state layout for full-page or large-section alerts.
 */
export function StatusState({ 
  icon: Icon, 
  iconColor = 'text-muted-foreground',
  bgColor = 'bg-muted',
  title, 
  description, 
  cta, 
  secondaryCta 
}: StateProps & { icon: LucideIcon; iconColor?: string; bgColor?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-in fade-in duration-500">
      <div className={`h-16 w-16 rounded-full ${bgColor} flex items-center justify-center mb-6`}>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2 text-foreground">{title}</h1>
      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        {cta && (
          cta.href ? (
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all shadow-sm active:scale-95"
            >
              {cta.icon && <cta.icon className="h-4 w-4" />}
              {cta.label}
            </Link>
          ) : (
            <button
              onClick={cta.onClick}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-all shadow-sm active:scale-95"
            >
              {cta.icon && <cta.icon className="h-4 w-4" />}
              {cta.label}
            </button>
          )
        )}
        
        {secondaryCta && (
          <Link
            href={secondaryCta.href}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-input bg-background rounded-md text-sm font-medium hover:bg-muted transition-all active:scale-95"
          >
            {secondaryCta.icon && <secondaryCta.icon className="h-4 w-4 text-muted-foreground" />}
            {secondaryCta.label}
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Specific State Presets ──────────────────────────────────────────────────

export function ErrorState({ reset, description }: { reset?: () => void; description?: string }) {
  return (
    <StatusState
      icon={AlertTriangle}
      iconColor="text-destructive"
      bgColor="bg-destructive/10"
      title="Something went wrong"
      description={description ?? "An unexpected error occurred. Our team has been notified. You can try again or return to the dashboard."}
      cta={reset ? {
        label: "Try Again",
        onClick: reset,
        icon: RefreshCw
      } : {
        label: "Go to Dashboard",
        href: "/dashboard",
        icon: Home
      }}
      secondaryCta={reset ? {
        label: "Back to Dashboard",
        href: "/dashboard",
        icon: Home
      } : undefined}
    />
  );
}

export function AccessDeniedState() {
  return (
    <StatusState
      icon={Lock}
      iconColor="text-amber-600"
      bgColor="bg-amber-100"
      title="Access Denied"
      description="You don't have permission to access this page. Please contact your agency administrator if you believe this is an error."
      cta={{
        label: "Return to Dashboard",
        href: "/dashboard",
        icon: Home
      }}
    />
  );
}

export function SessionExpiredState() {
  return (
    <StatusState
      icon={Clock}
      iconColor="text-indigo-600"
      bgColor="bg-indigo-100"
      title="Session Expired"
      description="Your session has timed out or you have been signed out. Please sign in again to continue working."
      cta={{
        label: "Sign In Again",
        href: "/login",
        icon: LogIn
      }}
    />
  );
}

export function InvalidLinkState({ title, description }: { title?: string; description?: string }) {
  return (
    <StatusState
      icon={FileQuestion}
      iconColor="text-slate-500"
      bgColor="bg-slate-100"
      title={title ?? "Invalid or Expired Link"}
      description={description ?? "This link is no longer valid or has expired. Please request a new link from your agency contact."}
      secondaryCta={{
        label: "Home",
        href: "/",
        icon: Home
      }}
    />
  );
}

export function SuccessState({ title, description, ctaLabel, ctaHref }: { 
  title: string; 
  description: string; 
  ctaLabel?: string; 
  ctaHref?: string;
}) {
  return (
    <StatusState
      icon={CheckCircle2}
      iconColor="text-emerald-600"
      bgColor="bg-emerald-100"
      title={title}
      description={description}
      cta={ctaLabel && ctaHref ? {
        label: ctaLabel,
        href: ctaHref,
        icon: ArrowRight
      } : undefined}
    />
  );
}
