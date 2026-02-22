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

export const releaseService = {
  async getAll(): Promise<ReleaseResponseDto[]> {
    const releases = await prisma.release.findMany({
      orderBy: { date: 'desc' },
    });

    return releases.map(mapReleaseToDto);
  },

  async getById(id: string): Promise<ReleaseResponseDto> {
    const release = await prisma.release.findUnique({
      where: { id },
    });

    if (!release) {
      throw new NotFoundError('Release', id);
    }

    return mapReleaseToDto(release);
  },

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

  async updateInfo(id: string, data: UpdateReleaseInfoDto): Promise<ReleaseResponseDto> {
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
      updatedSteps = existing.completedSteps.includes(data.stepId)
        ? existing.completedSteps
        : [...existing.completedSteps, data.stepId];
    } else {
      updatedSteps = existing.completedSteps.filter((s) => s !== data.stepId);
    }

    const release = await prisma.release.update({
      where: { id },
      data: { completedSteps: updatedSteps },
    });

    return mapReleaseToDto(release);
  },

  async delete(id: string): Promise<void> {
    const existing = await prisma.release.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Release', id);
    }

    await prisma.release.delete({ where: { id } });
  },
} as const;
