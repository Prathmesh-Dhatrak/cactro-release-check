import type { ReleaseRecord, ReleaseResponseDto } from '../types/release.types';
import { computeReleaseStatus } from './compute-status';

/**
 * Maps a raw database release record to the client-facing DTO.
 * Converts Date objects to ISO strings and computes the status.
 *
 * @param record - Raw release record from Prisma
 * @returns Formatted release response DTO
 */
export function mapReleaseToDto(record: ReleaseRecord): ReleaseResponseDto {
  return {
    id: record.id,
    name: record.name,
    date: record.date.toISOString(),
    status: computeReleaseStatus(record.completedSteps),
    additionalInfo: record.additionalInfo,
    completedSteps: record.completedSteps,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
