import { create } from 'zustand';

export type ModalType = 'try-on' | 'color' | 'body' | 'style-lab' | 'stylist' | 'quiz' | 'shop' | null;

interface OutfitState {
  activeOutfitIndex: number;
  setActiveOutfitIndex: (index: number) => void;
  tryOnActive: boolean;
  setTryOnActive: (active: boolean) => void;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  closeModal: () => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
}

export const useOutfitStore = create<OutfitState>((set) => ({
  activeOutfitIndex: 0,
  setActiveOutfitIndex: (index) => set({ activeOutfitIndex: index }),
  tryOnActive: false,
  setTryOnActive: (active) => set({ tryOnActive: active, activeModal: active ? 'try-on' : null }),
  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal, tryOnActive: modal === 'try-on' }),
  closeModal: () => set({ activeModal: null, tryOnActive: false }),
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
}));
