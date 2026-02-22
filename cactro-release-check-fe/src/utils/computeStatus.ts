import type { ReleaseStatus } from '@/types/release.types';

export function computeStatus(completedSteps: number[], totalSteps: number): ReleaseStatus {
  const count = completedSteps.length;

  if (count === 0) return 'planned';
  if (count >= totalSteps) return 'done';
  return 'ongoing';
}
