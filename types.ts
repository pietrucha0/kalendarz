// TYPESCRIPT REQUIREMENT 1: Union and Intersection types
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface BaseEntity {
  id: string;
  createdAt: Date;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
}

// Intersection type
export type Booking = BaseEntity & {
  userId: string;
  date: Date;
  slot: string;
  status: BookingStatus;
  notes?: string;
};

// TYPESCRIPT REQUIREMENT 2: Built-in generics (Pick, Omit, etc.)
// We only need specific fields for the booking display
export type BookingSummary = Pick<Booking, 'id' | 'date' | 'slot' | 'status'>;

export enum Steps {
  DATE_SELECTION = 0,
  DETAILS_FORM = 1,
  CONFIRMATION = 2,
}
