import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Trash2, Link as LinkIcon } from 'lucide-react';
import { useReleasesQuery, useDeleteReleaseMutation } from '@/hooks/useReleaseQueries';
import { useUIStore } from '@/store/useUIStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { CreateReleaseModal } from '@/components/releases/CreateReleaseModal';
import { formatDate } from '@/utils/format';

/**
 * Main page displaying the list of all releases.
 * Matches the left panel of the mockup design.
 */
export function ReleaseListPage(): JSX.Element {
  const { data: releases, isLoading, isError, error, refetch } = useReleasesQuery();
  const deleteMutation = useDeleteReleaseMutation();

  const openCreateModal = useUIStore((state) => state.openCreateModal);
  const deleteConfirmId = useUIStore((state) => state.deleteConfirmId);
  const setDeleteConfirmId = useUIStore((state) => state.setDeleteConfirmId);

  /** Handles delete confirmation */
  const handleDeleteConfirm = useCallback((): void => {
    if (!deleteConfirmId) return;

    deleteMutation.mutate(deleteConfirmId, {
      onSettled: () => {
        setDeleteConfirmId(null);
      },
    });
  }, [deleteConfirmId, deleteMutation, setDeleteConfirmId]);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LinkIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">All releases</span>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          New release
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      {isLoading && <LoadingSpinner message="Loading releases..." />}

      {isError && (
        <ErrorMessage
          message={error?.message ?? 'Failed to load releases'}
          onRetry={() => void refetch()}
        />
      )}

      {releases && releases.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-sm text-gray-500">No releases yet. Create your first release!</p>
        </div>
      )}

      {releases && releases.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Release
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {releases.map((release) => (
                <tr key={release.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {release.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(release.date)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={release.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/releases/${release.id}`}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(release.id)}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreateReleaseModal />

      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        title="Delete Release"
        message="Are you sure you want to delete this release? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
