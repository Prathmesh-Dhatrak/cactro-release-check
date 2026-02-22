import { clsx } from 'clsx';
import type { ReleaseStatus } from '@/types/release.types';
import { getStatusLabel, getStatusClasses } from '@/utils/format';

interface StatusBadgeProps {
  readonly status: ReleaseStatus;
}

export function StatusBadge({ status }: StatusBadgeProps): JSX.Element {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        getStatusClasses(status),
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
