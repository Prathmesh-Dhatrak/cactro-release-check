import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * UI state shape for the application.
 * Manages modal visibility and other transient UI state.
 */
interface UIState {
  /** Whether the "Create Release" modal is open */
  isCreateModalOpen: boolean;
  /** ID of the release pending deletion confirmation (null if none) */
  deleteConfirmId: string | null;
}

/**
 * UI actions for state mutations.
 */
interface UIActions {
  /** Opens the create release modal */
  openCreateModal: () => void;
  /** Closes the create release modal */
  closeCreateModal: () => void;
  /** Sets the release ID for delete confirmation */
  setDeleteConfirmId: (id: string | null) => void;
}

/** Combined UI store type */
type UIStore = UIState & UIActions;

/**
 * Zustand store for managing UI state.
 * Uses devtools middleware for Redux DevTools integration.
 */
export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      /* ─── Initial State ─── */
      isCreateModalOpen: false,
      deleteConfirmId: null,

      /* ─── Actions ─── */
      openCreateModal: () => set({ isCreateModalOpen: true }, false, 'ui/openCreateModal'),
      closeCreateModal: () => set({ isCreateModalOpen: false }, false, 'ui/closeCreateModal'),
      setDeleteConfirmId: (id) => set({ deleteConfirmId: id }, false, 'ui/setDeleteConfirmId'),
    }),
    { name: 'UIStore' },
  ),
);
