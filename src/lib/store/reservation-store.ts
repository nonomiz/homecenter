import { create } from 'zustand';
import { ReservationState, Reservation } from '../types';
import { apiClient } from '../api/client';

interface ReservationStore extends ReservationState {
  fetchReservations: () => Promise<void>;
  fetchReservationById: (id: string) => Promise<void>;
  createReservation: (reservationData: Partial<Reservation>) => Promise<void>;
  updateReservationStatus: (id: string, status: string) => Promise<void>;
  cancelReservation: (id: string) => Promise<void>;
  setSelectedReservation: (reservation: Reservation | null) => void;
}

export const useReservationStore = create<ReservationStore>((set, _) => ({
  reservations: [],
  selectedReservation: null,
  isLoading: false,
  error: null,

  fetchReservations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/reservations');
      set({ reservations: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch reservations', isLoading: false });
    }
  },

  fetchReservationById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/reservations/${id}`);
      set({ selectedReservation: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch reservation details', isLoading: false });
    }
  },

  createReservation: async (reservationData: Partial<Reservation>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/reservations', reservationData);
      set((state) => ({
        reservations: [...state.reservations, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create reservation', isLoading: false });
    }
  },

  updateReservationStatus: async (id: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put(`/reservations/${id}/status`, { status });
      set((state) => ({
        reservations: state.reservations.map((reservation) =>
          reservation.id === id ? response.data : reservation
        ),
        selectedReservation: response.data,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update reservation status', isLoading: false });
    }
  },

  cancelReservation: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.put(`/reservations/${id}/cancel`);
      set((state) => ({
        reservations: state.reservations.map((reservation) =>
          reservation.id === id
            ? { ...reservation, status: 'cancelled' }
            : reservation
        ),
        selectedReservation: null,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to cancel reservation', isLoading: false });
    }
  },

  setSelectedReservation: (reservation: Reservation | null) => {
    set({ selectedReservation: reservation });
  },
})); 