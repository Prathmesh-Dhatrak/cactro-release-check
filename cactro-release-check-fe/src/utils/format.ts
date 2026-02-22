import type { ReleaseStatus } from '@/types/release.types';

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateForInput(isoDate: string): string {
  return new Date(isoDate).toISOString().split('T')[0] ?? '';
}

export function getStatusLabel(status: ReleaseStatus): string {
  const labels: Record<ReleaseStatus, string> = {
    planned: 'Planned',
    ongoing: 'Ongoing',
    done: 'Done',
  };
  return labels[status];
}

export function getStatusClasses(status: ReleaseStatus): string {
  const classes: Record<ReleaseStatus, string> = {
    planned: 'bg-gray-100 text-gray-700 border-gray-300',
    ongoing: 'bg-amber-50 text-amber-700 border-amber-300',
    done: 'bg-green-50 text-green-700 border-green-300',
  };
  return classes[status];
}
