/**
 * Shared type definitions for the Release domain.
 * These mirror the backend DTOs for complete type safety across the stack.
 */

/** Possible statuses for a release, computed from step completion state */
export type ReleaseStatus = 'planned' | 'ongoing' | 'done';

/** Release data as returned by the API */
export interface Release {
  readonly id: string;
  readonly name: string;
  readonly date: string;
  readonly status: ReleaseStatus;
  readonly additionalInfo: string | null;
  readonly completedSteps: number[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** A single checklist step definition */
export interface ReleaseStep {
  readonly id: number;
  readonly label: string;
}

/** Payload for creating a new release */
export interface CreateReleasePayload {
  readonly name: string;
  readonly date: string;
  readonly additionalInfo?: string | null;
}

/** Payload for updating release additional info */
export interface UpdateReleaseInfoPayload {
  readonly additionalInfo: string | null;
}

/** Payload for toggling a step's completion state */
export interface ToggleStepPayload {
  readonly releaseId: string;
  readonly stepId: number;
  readonly completed: boolean;
}

/** Standard API response envelope from the backend */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string;
}

/** Standard API error response from the backend */
export interface ApiErrorResponse {
  readonly success: false;
  readonly error: string;
  readonly details?: unknown;
}
