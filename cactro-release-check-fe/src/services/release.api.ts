import { apiClient } from '@/lib/axios';
import type {
  Release,
  ReleaseStep,
  CreateReleasePayload,
  UpdateReleaseInfoPayload,
  ApiResponse,
} from '@/types/release.types';

/**
 * API service layer for Release endpoints.
 * Encapsulates all HTTP calls to the backend release API.
 * Each method returns the unwrapped data from the API response envelope.
 */
export const releaseApi = {
  /**
   * Fetches all releases from the API.
   * @returns Array of releases sorted by date descending
   */
  async getAll(): Promise<Release[]> {
    const response = await apiClient.get<ApiResponse<Release[]>>('/releases');
    return response.data.data;
  },

  /**
   * Fetches a single release by ID.
   * @param id - UUID of the release
   * @returns Release data
   */
  async getById(id: string): Promise<Release> {
    const response = await apiClient.get<ApiResponse<Release>>(`/releases/${id}`);
    return response.data.data;
  },

  /**
   * Fetches the list of available checklist steps.
   * @returns Array of step definitions
   */
  async getSteps(): Promise<ReleaseStep[]> {
    const response = await apiClient.get<ApiResponse<ReleaseStep[]>>('/releases/steps');
    return response.data.data;
  },

  /**
   * Creates a new release.
   * @param payload - Release creation data
   * @returns Newly created release
   */
  async create(payload: CreateReleasePayload): Promise<Release> {
    const response = await apiClient.post<ApiResponse<Release>>('/releases', payload);
    return response.data.data;
  },

  /**
   * Updates the additional info of a release.
   * @param id - UUID of the release
   * @param payload - Updated additional info
   * @returns Updated release
   */
  async updateInfo(id: string, payload: UpdateReleaseInfoPayload): Promise<Release> {
    const response = await apiClient.patch<ApiResponse<Release>>(
      `/releases/${id}/info`,
      payload,
    );
    return response.data.data;
  },

  /**
   * Toggles a step's completion state for a release.
   * @param id - UUID of the release
   * @param stepId - Numeric step ID
   * @param completed - Whether the step should be marked as completed
   * @returns Updated release
   */
  async toggleStep(id: string, stepId: number, completed: boolean): Promise<Release> {
    const response = await apiClient.patch<ApiResponse<Release>>(
      `/releases/${id}/steps`,
      { stepId, completed },
    );
    return response.data.data;
  },

  /**
   * Deletes a release.
   * @param id - UUID of the release
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/releases/${id}`);
  },
} as const;
