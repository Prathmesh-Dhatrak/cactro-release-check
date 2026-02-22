import { TOTAL_STEPS } from '../config/steps';
import type { ReleaseStatus } from '../types/release.types';

// no steps = planned, some = ongoing, all = done
export function computeReleaseStatus(completedSteps: number[]): ReleaseStatus {
  const completedCount = completedSteps.length;

  if (completedCount === 0) {
    return 'planned';
  }

  if (completedCount >= TOTAL_STEPS) {
    return 'done';
  }

  return 'ongoing';
}
