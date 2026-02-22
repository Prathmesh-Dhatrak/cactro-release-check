import { TOTAL_STEPS } from '../config/steps';
import type { ReleaseStatus } from '../types/release.types';

/**
 * Computes the release status based on the number of completed steps.
 *
 * Business rules:
 * - No steps completed → "planned"
 * - At least one step completed → "ongoing"
 * - All steps completed → "done"
 *
 * @param completedSteps - Array of completed step IDs
 * @returns The computed release status
 */
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
