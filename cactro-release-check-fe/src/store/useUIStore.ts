import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  isCreateModalOpen: boolean;
  deleteConfirmId: string | null;
}

interface UIActions {
  openCreateModal: () => void;
  closeCreateModal: () => void;
  setDeleteConfirmId: (id: string | null) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      isCreateModalOpen: false,
      deleteConfirmId: null,

      openCreateModal: () => set({ isCreateModalOpen: true }, false, 'ui/openCreateModal'),
      closeCreateModal: () => set({ isCreateModalOpen: false }, false, 'ui/closeCreateModal'),
      setDeleteConfirmId: (id) => set({ deleteConfirmId: id }, false, 'ui/setDeleteConfirmId'),
    }),
    { name: 'UIStore' },
  ),
);
