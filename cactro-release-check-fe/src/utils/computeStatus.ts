import type { ReleaseStatus } from '@/types/release.types';

/**
 * Computes the release status on the client side for optimistic UI updates.
 *
 * @param completedSteps - Array of completed step IDs
 * @param totalSteps - Total number of steps in the checklist
 * @returns Computed release status
 */
export function computeStatus(completedSteps: number[], totalSteps: number): ReleaseStatus {
  const count = completedSteps.length;

  if (count === 0) return 'planned';
  if (count >= totalSteps) return 'done';
  return 'ongoing';
}
