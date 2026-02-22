import type { ReleaseStatus } from '@/types/release.types';

/**
 * Formats an ISO date string to a human-readable format.
 * @param isoDate - ISO 8601 date string
 * @returns Formatted date string (e.g., "September 20, 2022")
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats an ISO date string to an input-compatible format.
 * @param isoDate - ISO 8601 date string
 * @returns Date string in YYYY-MM-DD format
 */
export function formatDateForInput(isoDate: string): string {
  return new Date(isoDate).toISOString().split('T')[0] ?? '';
}

/**
 * Returns the display label for a release status.
 * @param status - Release status
 * @returns Capitalized status label
 */
export function getStatusLabel(status: ReleaseStatus): string {
  const labels: Record<ReleaseStatus, string> = {
    planned: 'Planned',
    ongoing: 'Ongoing',
    done: 'Done',
  };
  return labels[status];
}

/**
 * Returns Tailwind CSS classes for status badge styling.
 * @param status - Release status
 * @returns CSS class string
 */
export function getStatusClasses(status: ReleaseStatus): string {
  const classes: Record<ReleaseStatus, string> = {
    planned: 'bg-gray-100 text-gray-700 border-gray-300',
    ongoing: 'bg-amber-50 text-amber-700 border-amber-300',
    done: 'bg-green-50 text-green-700 border-green-300',
  };
  return classes[status];
}
