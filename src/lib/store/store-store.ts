import { create } from 'zustand';
import { StoreState, Store } from '../types';
import { apiClient } from '../api/client';

interface StoreStore extends StoreState {
  fetchStores: () => Promise<void>;
  fetchStoreById: (id: string) => Promise<void>;
  createStore: (storeData: Partial<Store>) => Promise<void>;
  updateStore: (id: string, storeData: Partial<Store>) => Promise<void>;
  deleteStore: (id: string) => Promise<void>;
  setSelectedStore: (store: Store | null) => void;
}

export const useStoreStore = create<StoreStore>((set, get) => ({
  stores: [],
  selectedStore: null,
  isLoading: false,
  error: null,

  fetchStores: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/stores');
      set({ stores: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch stores', isLoading: false });
    }
  },

  fetchStoreById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/stores/${id}`);
      set({ selectedStore: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch store details', isLoading: false });
    }
  },

  createStore: async (storeData: Partial<Store>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/stores', storeData);
      set((state) => ({
        stores: [...state.stores, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create store', isLoading: false });
    }
  },

  updateStore: async (id: string, storeData: Partial<Store>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put(`/stores/${id}`, storeData);
      set((state) => ({
        stores: state.stores.map((store) =>
          store.id === id ? response.data : store
        ),
        selectedStore: response.data,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update store', isLoading: false });
    }
  },

  deleteStore: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/stores/${id}`);
      set((state) => ({
        stores: state.stores.filter((store) => store.id !== id),
        selectedStore: null,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete store', isLoading: false });
    }
  },

  setSelectedStore: (store: Store | null) => {
    set({ selectedStore: store });
  },
})); 