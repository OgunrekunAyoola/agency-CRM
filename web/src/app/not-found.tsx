import { FileSearch, Home } from 'lucide-react';
import { StatusState } from '@/components/ui/StateVisuals';

export default function NotFound() {
  return (
    <StatusState
      icon={FileSearch}
      title="404 - Page Not Found"
      description="The page you're looking for doesn't exist or may have been moved."
      cta={{
        label: "Back to Dashboard",
        href: "/dashboard",
        icon: Home
      }}
    />
  );
}
