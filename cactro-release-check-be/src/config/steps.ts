/**
 * Default release checklist steps.
 * These are the same for every release and don't change over time.
 * Each step has a unique numeric ID and a descriptive label.
 */
export interface ReleaseStep {
  /** Unique numeric identifier for the step */
  readonly id: number;
  /** Human-readable label for the step */
  readonly label: string;
}

/**
 * Predefined release checklist steps.
 * Steps are ordered by typical release workflow sequence.
 */
export const RELEASE_STEPS: readonly ReleaseStep[] = [
  { id: 0, label: 'All relevant GitHub pull requests have been merged' },
  { id: 1, label: 'CHANGELOG / Release notes have been updated' },
  { id: 2, label: 'All tests are passing' },
  { id: 3, label: 'Release is GitHub created' },
  { id: 4, label: 'Deployed to demo' },
  { id: 5, label: 'Tested thoroughly in demo' },
  { id: 6, label: 'Deployed to production' },
] as const;

/** Total number of steps in a release checklist */
export const TOTAL_STEPS: number = RELEASE_STEPS.length;

/**
 * Validates that a step ID is within the valid range.
 * @param stepId - The step ID to validate
 * @returns Whether the step ID is valid
 */
export function isValidStepId(stepId: number): boolean {
  return Number.isInteger(stepId) && stepId >= 0 && stepId < TOTAL_STEPS;
}
