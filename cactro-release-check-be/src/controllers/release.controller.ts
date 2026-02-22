import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { releaseService } from '../services/release.service';
import type {
  ApiResponse,
  ReleaseResponseDto,
  CreateReleaseDto,
  UpdateReleaseInfoDto,
  ToggleStepDto,
} from '../types/release.types';
import { RELEASE_STEPS } from '../config/steps';

/**
 * Controller layer for Release endpoints.
 * Handles HTTP request/response mapping and delegates to the service layer.
 */
export const releaseController = {
  /**
   * GET /api/releases
   * Returns all releases sorted by date descending.
   */
  async getAll(_req: Request, res: Response): Promise<void> {
    const releases = await releaseService.getAll();

    const response: ApiResponse<ReleaseResponseDto[]> = {
      success: true,
      data: releases,
    };

    res.status(StatusCodes.OK).json(response);
  },

  /**
   * GET /api/releases/:id
   * Returns a single release by ID.
   */
  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const release = await releaseService.getById(id as string);

    const response: ApiResponse<ReleaseResponseDto> = {
      success: true,
      data: release,
    };

    res.status(StatusCodes.OK).json(response);
  },

  /**
   * POST /api/releases
   * Creates a new release.
   */
  async create(req: Request, res: Response): Promise<void> {
    const data = req.body as CreateReleaseDto;
    const release = await releaseService.create(data);

    const response: ApiResponse<ReleaseResponseDto> = {
      success: true,
      data: release,
      message: 'Release created successfully',
    };

    res.status(StatusCodes.CREATED).json(response);
  },

  /**
   * PATCH /api/releases/:id/info
   * Updates the additional info of a release.
   */
  async updateInfo(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = req.body as UpdateReleaseInfoDto;
    const release = await releaseService.updateInfo(id as string, data);

    const response: ApiResponse<ReleaseResponseDto> = {
      success: true,
      data: release,
      message: 'Release info updated successfully',
    };

    res.status(StatusCodes.OK).json(response);
  },

  /**
   * PATCH /api/releases/:id/steps
   * Toggles a step's completion state.
   */
  async toggleStep(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = req.body as ToggleStepDto;
    const release = await releaseService.toggleStep(id as string, data);

    const response: ApiResponse<ReleaseResponseDto> = {
      success: true,
      data: release,
      message: 'Step toggled successfully',
    };

    res.status(StatusCodes.OK).json(response);
  },

  /**
   * DELETE /api/releases/:id
   * Deletes a release.
   */
  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await releaseService.delete(id as string);

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Release deleted successfully',
    };

    res.status(StatusCodes.OK).json(response);
  },

  /**
   * GET /api/releases/steps
   * Returns the list of all available release steps.
   * This is a static endpoint — steps don't change over time.
   */
  async getSteps(_req: Request, res: Response): Promise<void> {
    const response: ApiResponse<typeof RELEASE_STEPS> = {
      success: true,
      data: RELEASE_STEPS,
    };

    res.status(StatusCodes.OK).json(response);
  },
} as const;
