/**
 * Type definitions for the Release domain model.
 * These types are used across controllers, services, and validators.
 */

/** Possible statuses for a release, computed from step completion state */
export type ReleaseStatus = 'planned' | 'ongoing' | 'done';

/** Raw release record from the database */
export interface ReleaseRecord {
  readonly id: string;
  readonly name: string;
  readonly date: Date;
  readonly additionalInfo: string | null;
  readonly completedSteps: number[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/** Release response DTO sent to the client */
export interface ReleaseResponseDto {
  readonly id: string;
  readonly name: string;
  readonly date: string;
  readonly status: ReleaseStatus;
  readonly additionalInfo: string | null;
  readonly completedSteps: number[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Payload for creating a new release */
export interface CreateReleaseDto {
  readonly name: string;
  readonly date: string;
  readonly additionalInfo?: string | null;
}

/** Payload for updating release additional info */
export interface UpdateReleaseInfoDto {
  readonly additionalInfo: string | null;
}

/** Payload for toggling a step's completion state */
export interface ToggleStepDto {
  readonly stepId: number;
  readonly completed: boolean;
}

/** Standard API response envelope */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string;
}

/** Standard API error response */
export interface ApiErrorResponse {
  readonly success: false;
  readonly error: string;
  readonly details?: unknown;
}
