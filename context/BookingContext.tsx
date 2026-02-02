import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, BookingFormValues } from '../lib/validation';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: BookingFormValues) => void;
  isSlotTaken: (date: Date, slot: string) => boolean;
  getBookingsForDate: (date: Date) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (newBooking: BookingFormValues) => {
    const bookingEntry: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      userId: 'guest', // Mock user
      status: 'confirmed',
      ...newBooking
    };
    setBookings((prev) => [...prev, bookingEntry]);
  };

  const isSlotTaken = (date: Date, slot: string) => {
    return bookings.some(b => 
      b.date.getDate() === date.getDate() &&
      b.date.getMonth() === date.getMonth() &&
      b.date.getFullYear() === date.getFullYear() &&
      b.slot === slot
    );
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(b => 
      b.date.getDate() === date.getDate() &&
      b.date.getMonth() === date.getMonth() &&
      b.date.getFullYear() === date.getFullYear()
    );
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, isSlotTaken, getBookingsForDate }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};