import { computeReleaseStatus } from '../utils/compute-status';

describe('computeReleaseStatus', () => {
  it('returns "planned" when no steps are completed', () => {
    expect(computeReleaseStatus([])).toBe('planned');
  });

  it('returns "ongoing" when some steps are completed', () => {
    expect(computeReleaseStatus([0, 1])).toBe('ongoing');
    expect(computeReleaseStatus([3])).toBe('ongoing');
  });

  it('returns "done" when all steps are completed', () => {
    expect(computeReleaseStatus([0, 1, 2, 3, 4, 5, 6])).toBe('done');
  });

  it('returns "done" even with extra step IDs', () => {
    expect(computeReleaseStatus([0, 1, 2, 3, 4, 5, 6, 7, 8])).toBe('done');
  });
});
