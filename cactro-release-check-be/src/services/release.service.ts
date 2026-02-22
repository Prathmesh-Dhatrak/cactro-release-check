import { prisma } from '../config/database';
import { isValidStepId } from '../config/steps';
import { NotFoundError, AppError } from '../middleware/error-handler';
import type {
  ReleaseResponseDto,
  CreateReleaseDto,
  UpdateReleaseInfoDto,
  ToggleStepDto,
} from '../types/release.types';
import { mapReleaseToDto } from '../utils/map-release';
import { StatusCodes } from 'http-status-codes';

/**
 * Service layer for Release business logic.
 * Encapsulates all database operations and domain logic for releases.
 */
export const releaseService = {
  /**
   * Retrieves all releases, ordered by date descending (newest first).
   * @returns Array of release DTOs
   */
  async getAll(): Promise<ReleaseResponseDto[]> {
    const releases = await prisma.release.findMany({
      orderBy: { date: 'desc' },
    });

    return releases.map(mapReleaseToDto);
  },

  /**
   * Retrieves a single release by its unique ID.
   * @param id - UUID of the release
   * @returns Release DTO
   * @throws NotFoundError if the release doesn't exist
   */
  async getById(id: string): Promise<ReleaseResponseDto> {
    const release = await prisma.release.findUnique({
      where: { id },
    });

    if (!release) {
      throw new NotFoundError('Release', id);
    }

    return mapReleaseToDto(release);
  },

  /**
   * Creates a new release with the provided data.
   * Initializes with no completed steps (status: "planned").
   * @param data - Release creation payload
   * @returns Newly created release DTO
   */
  async create(data: CreateReleaseDto): Promise<ReleaseResponseDto> {
    const release = await prisma.release.create({
      data: {
        name: data.name,
        date: new Date(data.date),
        additionalInfo: data.additionalInfo ?? null,
        completedSteps: [],
      },
    });

    return mapReleaseToDto(release);
  },

  /**
   * Updates the additional info field of a release.
   * @param id - UUID of the release
   * @param data - Updated additional info payload
   * @returns Updated release DTO
   * @throws NotFoundError if the release doesn't exist
   */
  async updateInfo(id: string, data: UpdateReleaseInfoDto): Promise<ReleaseResponseDto> {
    /* Verify the release exists before updating */
    const existing = await prisma.release.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Release', id);
    }

    const release = await prisma.release.update({
      where: { id },
      data: {
        additionalInfo: data.additionalInfo,
      },
    });

    return mapReleaseToDto(release);
  },

  /**
   * Toggles a step's completion state for a release.
   * Adds or removes the step ID from the completedSteps array.
   * @param id - UUID of the release
   * @param data - Step toggle payload
   * @returns Updated release DTO
   * @throws NotFoundError if the release doesn't exist
   * @throws AppError if the step ID is invalid
   */
  async toggleStep(id: string, data: ToggleStepDto): Promise<ReleaseResponseDto> {
    const existing = await prisma.release.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Release', id);
    }

    if (!isValidStepId(data.stepId)) {
      throw new AppError(`Invalid step ID: ${data.stepId}`, StatusCodes.BAD_REQUEST);
    }

    let updatedSteps: number[];

    if (data.completed) {
      /* Add step if not already present */
      updatedSteps = existing.completedSteps.includes(data.stepId)
        ? existing.completedSteps
        : [...existing.completedSteps, data.stepId];
    } else {
      /* Remove step from completed list */
      updatedSteps = existing.completedSteps.filter((s) => s !== data.stepId);
    }

    const release = await prisma.release.update({
      where: { id },
      data: { completedSteps: updatedSteps },
    });

    return mapReleaseToDto(release);
  },

  /**
   * Deletes a release by its unique ID.
   * @param id - UUID of the release
   * @throws NotFoundError if the release doesn't exist
   */
  async delete(id: string): Promise<void> {
    const existing = await prisma.release.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Release', id);
    }

    await prisma.release.delete({ where: { id } });
  },
} as const;
