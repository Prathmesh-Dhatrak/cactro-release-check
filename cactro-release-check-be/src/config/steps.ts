export interface ReleaseStep {
  readonly id: number;
  readonly label: string;
}

// static steps — same for every release
export const RELEASE_STEPS: readonly ReleaseStep[] = [
  { id: 0, label: 'All relevant GitHub pull requests have been merged' },
  { id: 1, label: 'CHANGELOG / Release notes have been updated' },
  { id: 2, label: 'All tests are passing' },
  { id: 3, label: 'Release is GitHub created' },
  { id: 4, label: 'Deployed to demo' },
  { id: 5, label: 'Tested thoroughly in demo' },
  { id: 6, label: 'Deployed to production' },
] as const;

export const TOTAL_STEPS: number = RELEASE_STEPS.length;

export function isValidStepId(stepId: number): boolean {
  return Number.isInteger(stepId) && stepId >= 0 && stepId < TOTAL_STEPS;
}
