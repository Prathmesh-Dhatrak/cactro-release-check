export type ReleaseStatus = 'planned' | 'ongoing' | 'done';

export interface ReleaseRecord {
  readonly id: string;
  readonly name: string;
  readonly date: Date;
  readonly additionalInfo: string | null;
  readonly completedSteps: number[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

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

export interface CreateReleaseDto {
  readonly name: string;
  readonly date: string;
  readonly additionalInfo?: string | null;
}

export interface UpdateReleaseInfoDto {
  readonly additionalInfo: string | null;
}

export interface ToggleStepDto {
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
