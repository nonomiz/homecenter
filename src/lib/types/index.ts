export type UserRole = 'admin' | 'store' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  operatingHours: string;
  ownerId: string;
  images: StoreImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreImage {
  id: string;
  storeId: string;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: Date;
}

export interface Reservation {
  id: string;
  storeId: string;
  userId: string;
  reservationDate: Date;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface StoreState {
  stores: Store[];
  selectedStore: Store | null;
  isLoading: boolean;
  error: string | null;
}

export interface ReservationState {
  reservations: Reservation[];
  selectedReservation: Reservation | null;
  isLoading: boolean;
  error: string | null;
} 