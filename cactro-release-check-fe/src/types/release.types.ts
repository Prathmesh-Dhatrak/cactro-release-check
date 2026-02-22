export type ReleaseStatus = 'planned' | 'ongoing' | 'done';

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

export interface ReleaseStep {
  readonly id: number;
  readonly label: string;
}

export interface CreateReleasePayload {
  readonly name: string;
  readonly date: string;
  readonly additionalInfo?: string | null;
}

export interface UpdateReleaseInfoPayload {
  readonly additionalInfo: string | null;
}

export interface ToggleStepPayload {
  readonly releaseId: string;
  readonly stepId: number;
  readonly completed: boolean;
}

export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T;
  readonly message?: string;
}

export interface ApiErrorResponse {
  readonly success: false;
  readonly error: string;
  readonly details?: unknown;
}
