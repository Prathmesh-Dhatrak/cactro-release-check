import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import { releaseApi } from '@/services/release.api';
import { QUERY_KEYS, STALE_TIME } from '@/config/constants';
import { getErrorMessage } from '@/lib/axios';
import type {
  Release,
  ReleaseStep,
  CreateReleasePayload,
  UpdateReleaseInfoPayload,
  ToggleStepPayload,
} from '@/types/release.types';
import toast from 'react-hot-toast';

/**
 * TanStack Query hook for fetching all releases.
 */
export function useReleasesQuery(): UseQueryResult<Release[], Error> {
  return useQuery({
    queryKey: QUERY_KEYS.releases.all,
    queryFn: releaseApi.getAll,
    staleTime: STALE_TIME,
  });
}

/**
 * TanStack Query hook for fetching a single release by ID.
 * @param id - UUID of the release
 */
export function useReleaseQuery(id: string): UseQueryResult<Release, Error> {
  return useQuery({
    queryKey: QUERY_KEYS.releases.detail(id),
    queryFn: () => releaseApi.getById(id),
    staleTime: STALE_TIME,
    enabled: !!id,
  });
}

/**
 * TanStack Query hook for fetching available checklist steps.
 */
export function useStepsQuery(): UseQueryResult<ReleaseStep[], Error> {
  return useQuery({
    queryKey: QUERY_KEYS.releases.steps,
    queryFn: releaseApi.getSteps,
    staleTime: Infinity, /* Steps are static and never change */
  });
}

/**
 * Mutation hook for creating a new release.
 * Invalidates the releases list cache on success.
 */
export function useCreateReleaseMutation(): UseMutationResult<
  Release,
  Error,
  CreateReleasePayload
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReleasePayload) => releaseApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.releases.all });
      toast.success('Release created successfully');
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/**
 * Mutation hook for updating release additional info.
 * Invalidates both the list and detail caches on success.
 */
export function useUpdateReleaseInfoMutation(): UseMutationResult<
  Release,
  Error,
  { id: string; payload: UpdateReleaseInfoPayload }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => releaseApi.updateInfo(id, payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.releases.all });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.releases.detail(data.id),
      });
      toast.success('Release info updated');
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/**
 * Mutation hook for toggling a step's completion state.
 * Uses optimistic updates for instant UI feedback.
 */
export function useToggleStepMutation(): UseMutationResult<
  Release,
  Error,
  ToggleStepPayload
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ releaseId, stepId, completed }: ToggleStepPayload) =>
      releaseApi.toggleStep(releaseId, stepId, completed),
    onMutate: async ({ releaseId, stepId, completed }: ToggleStepPayload) => {
      /* Cancel outgoing refetches to avoid overwriting optimistic update */
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.releases.detail(releaseId),
      });

      const previousRelease = queryClient.getQueryData<Release>(
        QUERY_KEYS.releases.detail(releaseId),
      );

      /* Optimistically update the cache */
      if (previousRelease) {
        const updatedSteps = completed
          ? [...previousRelease.completedSteps, stepId]
          : previousRelease.completedSteps.filter((s) => s !== stepId);

        queryClient.setQueryData<Release>(
          QUERY_KEYS.releases.detail(releaseId),
          {
            ...previousRelease,
            completedSteps: updatedSteps,
          },
        );
      }

      return { previousRelease };
    },
    onError: (error, { releaseId }, context) => {
      /* Rollback on error */
      if (context?.previousRelease) {
        queryClient.setQueryData(
          QUERY_KEYS.releases.detail(releaseId),
          context.previousRelease,
        );
      }
      toast.error(getErrorMessage(error));
    },
    onSettled: (_data, _error, { releaseId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.releases.detail(releaseId),
      });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.releases.all });
    },
  });
}

/**
 * Mutation hook for deleting a release.
 * Invalidates the releases list cache on success.
 */
export function useDeleteReleaseMutation(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => releaseApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.releases.all });
      toast.success('Release deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
