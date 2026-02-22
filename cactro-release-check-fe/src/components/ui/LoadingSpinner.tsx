import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  /** Optional size class override */
  readonly className?: string;
  /** Optional loading message */
  readonly message?: string;
}

/**
 * Animated loading spinner with optional message.
 */
export function LoadingSpinner({ className, message }: LoadingSpinnerProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 className={clsx('animate-spin text-primary-600', className ?? 'h-8 w-8')} />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );
}
