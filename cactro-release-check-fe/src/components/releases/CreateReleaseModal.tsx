import { useState, useCallback, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { useCreateReleaseMutation } from '@/hooks/useReleaseQueries';

/**
 * Modal form for creating a new release.
 * Validates required fields before submission.
 */
export function CreateReleaseModal(): JSX.Element | null {
  const isOpen = useUIStore((state) => state.isCreateModalOpen);
  const closeModal = useUIStore((state) => state.closeCreateModal);
  const createMutation = useCreateReleaseMutation();

  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  /** Resets form fields to their initial state */
  const resetForm = useCallback((): void => {
    setName('');
    setDate('');
    setAdditionalInfo('');
  }, []);

  /** Handles form submission */
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();

      if (!name.trim() || !date) return;

      createMutation.mutate(
        {
          name: name.trim(),
          date: new Date(date).toISOString(),
          additionalInfo: additionalInfo.trim() || null,
        },
        {
          onSuccess: () => {
            resetForm();
            closeModal();
          },
        },
      );
    },
    [name, date, additionalInfo, createMutation, resetForm, closeModal],
  );

  /** Handles modal close with form reset */
  const handleClose = useCallback((): void => {
    resetForm();
    closeModal();
  }, [resetForm, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
        role="presentation"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">New Release</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Release Name */}
          <div>
            <label htmlFor="release-name" className="block text-sm font-medium text-gray-700">
              Release Name <span className="text-red-500">*</span>
            </label>
            <input
              id="release-name"
              type="text"
              required
              maxLength={255}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Version 2.0.0"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Release Date */}
          <div>
            <label htmlFor="release-date" className="block text-sm font-medium text-gray-700">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              id="release-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Additional Info */}
          <div>
            <label htmlFor="release-info" className="block text-sm font-medium text-gray-700">
              Additional Information
            </label>
            <textarea
              id="release-info"
              rows={3}
              maxLength={5000}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Please enter any other important notes for this release..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || !name.trim() || !date}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Release'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
