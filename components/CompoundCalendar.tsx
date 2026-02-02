import React from "react";
import { cn } from "../utils/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBookings } from "../context/BookingContext";

// Context for the compound component
interface CalendarContextValue {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
}

const CalendarContext = React.createContext<CalendarContextValue | undefined>(undefined);

const useCalendar = () => {
  const context = React.useContext(CalendarContext);
  if (!context) throw new Error("Calendar parts must be used within Calendar.Root");
  return context;
};

// 1. ROOT
interface CalendarRootProps {
  children?: React.ReactNode;
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
}

const Root = ({ children, selectedDate, onDateSelect, className }: CalendarRootProps) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  return (
    <CalendarContext.Provider value={{ currentMonth, onMonthChange: setCurrentMonth, selectedDate, onDateSelect }}>
      <div className={cn("p-4 bg-white rounded-lg shadow-sm border border-pink-100", className)}>
        {children}
      </div>
    </CalendarContext.Provider>
  );
};

// 2. HEADER
const Header = () => {
  const { currentMonth, onMonthChange } = useCalendar();

  const nextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <button onClick={prevMonth} className="p-1 hover:bg-pink-50 rounded-full transition-colors">
        <ChevronLeft className="w-5 h-5 text-pink-600" />
      </button>
      <h2 className="text-lg font-semibold text-pink-900">
        {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </h2>
      <button onClick={nextMonth} className="p-1 hover:bg-pink-50 rounded-full transition-colors">
        <ChevronRight className="w-5 h-5 text-pink-600" />
      </button>
    </div>
  );
};

// 3. GRID (Days)
const Grid = () => {
  const { currentMonth, selectedDate, onDateSelect } = useCalendar();
  const { getBookingsForDate } = useBookings();

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const hasBooking = (day: number) => {
    const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const bookings = getBookingsForDate(dateToCheck);
    return bookings.length > 0;
  }

  return (
    <div>
        <div className="grid grid-cols-7 mb-2 text-center text-xs text-pink-400 font-medium">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => (
            <div key={`blank-${i}`} />
        ))}
        {days.map((day) => (
            <div key={day} className="relative">
                <button
                type="button"
                onClick={() => onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center text-sm transition-all relative",
                    // TAILWINDCSS REQUIREMENT 2: Pseudo classes
                    "hover:bg-pink-100 focus:ring-2 focus:ring-pink-300",
                    isSelected(day)
                    ? "bg-pink-600 text-white hover:bg-pink-700 shadow-md scale-105"
                    : "text-slate-700 bg-transparent"
                )}
                >
                {day}
                </button>
                {/* Visual indicator for existing bookings */}
                {hasBooking(day) && !isSelected(day) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full" />
                )}
            </div>
        ))}
        </div>
    </div>
  );
};

// Export as Compound Component
export const Calendar = {
  Root,
  Header,
  Grid,
};
