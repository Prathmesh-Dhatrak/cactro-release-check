import { apiClient } from '@/lib/axios';
import type {
  Release,
  ReleaseStep,
  CreateReleasePayload,
  UpdateReleaseInfoPayload,
  ApiResponse,
} from '@/types/release.types';

export const releaseApi = {
  async getAll(): Promise<Release[]> {
    const response = await apiClient.get<ApiResponse<Release[]>>('/releases');
    return response.data.data;
  },

  async getById(id: string): Promise<Release> {
    const response = await apiClient.get<ApiResponse<Release>>(`/releases/${id}`);
    return response.data.data;
  },

  async getSteps(): Promise<ReleaseStep[]> {
    const response = await apiClient.get<ApiResponse<ReleaseStep[]>>('/releases/steps');
    return response.data.data;
  },

  async create(payload: CreateReleasePayload): Promise<Release> {
    const response = await apiClient.post<ApiResponse<Release>>('/releases', payload);
    return response.data.data;
  },

  async updateInfo(id: string, payload: UpdateReleaseInfoPayload): Promise<Release> {
    const response = await apiClient.patch<ApiResponse<Release>>(
      `/releases/${id}/info`,
      payload,
    );
    return response.data.data;
  },

  async toggleStep(id: string, stepId: number, completed: boolean): Promise<Release> {
    const response = await apiClient.patch<ApiResponse<Release>>(
      `/releases/${id}/steps`,
      { stepId, completed },
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/releases/${id}`);
  },
} as const;
