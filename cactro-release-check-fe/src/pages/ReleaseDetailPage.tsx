import { useState, useCallback, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Check } from 'lucide-react';
import {
  useReleaseQuery,
  useStepsQuery,
  useToggleStepMutation,
  useUpdateReleaseInfoMutation,
} from '@/hooks/useReleaseQueries';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { formatDate } from '@/utils/format';
import { computeStatus } from '@/utils/computeStatus';
import { ROUTES } from '@/config/constants';

export function ReleaseDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const releaseId = id ?? '';

  const { data: release, isLoading, isError, error, refetch } = useReleaseQuery(releaseId);
  const { data: steps } = useStepsQuery();
  const toggleStepMutation = useToggleStepMutation();
  const updateInfoMutation = useUpdateReleaseInfoMutation();

  const [additionalInfo, setAdditionalInfo] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const startEditing = useCallback((): void => {
    setAdditionalInfo(release?.additionalInfo ?? '');
    setIsEditing(true);
  }, [release?.additionalInfo]);

  const handleSaveInfo = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      if (!releaseId) return;

      updateInfoMutation.mutate(
        {
          id: releaseId,
          payload: { additionalInfo: additionalInfo?.trim() || null },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        },
      );
    },
    [releaseId, additionalInfo, updateInfoMutation],
  );

  const handleToggleStep = useCallback(
    (stepId: number, currentlyCompleted: boolean): void => {
      if (!releaseId) return;

      toggleStepMutation.mutate({
        releaseId,
        stepId,
        completed: !currentlyCompleted,
      });
    },
    [releaseId, toggleStepMutation],
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading release details..." />;
  }

  if (isError || !release) {
    return (
      <ErrorMessage
        message={error?.message ?? 'Failed to load release'}
        onRetry={() => void refetch()}
      />
    );
  }

  const liveStatus = computeStatus(release.completedSteps, steps?.length ?? 7);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-1 text-primary-600 transition-colors hover:text-primary-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All releases
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-600">{release.name}</span>
        </div>
        <StatusBadge status={liveStatus} />
      </div>

      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
              Release
            </label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{release.name}</p>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
              Date
            </label>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {formatDate(release.date)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Release Checklist
        </h3>
        <div className="space-y-2">
          {steps?.map((step) => {
            const isCompleted = release.completedSteps.includes(step.id);
            return (
              <label
                key={step.id}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => handleToggleStep(step.id, isCompleted)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <span
                  className={`text-sm ${
                    isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}
                >
                  {step.label}
                </span>
                {isCompleted && (
                  <Check className="ml-auto h-4 w-4 text-green-500" />
                )}
              </label>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Additional remarks / notes
        </h3>

        {isEditing ? (
          <form onSubmit={handleSaveInfo}>
            <textarea
              rows={4}
              maxLength={5000}
              value={additionalInfo ?? ''}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Please enter any other important notes for this release..."
              className="block w-full rounded-md border border-primary-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              autoFocus
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateInfoMutation.isPending}
                className="inline-flex items-center gap-1 rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="h-3 w-3" />
                {updateInfoMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        ) : (
          <div
            onClick={startEditing}
            onKeyDown={(e) => {
              if (e.key === 'Enter') startEditing();
            }}
            role="button"
            tabIndex={0}
            className="min-h-[80px] cursor-pointer rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 transition-colors hover:border-primary-400 hover:bg-primary-50"
          >
            {release.additionalInfo || 'Click to add notes...'}
          </div>
        )}
      </div>
    </div>
  );
}
