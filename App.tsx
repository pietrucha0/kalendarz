import React from "react";
import { BookingForm } from "./components/BookingForm";
import { StatsChart } from "./components/StatsChart";
import { Popover } from "./components/ui/tooltip";
import { Button } from "./components/ui/primitives";
import { Menu, Calendar, Clock } from "lucide-react";
import { useBookings } from "./context/BookingContext";

function App() {
  const { bookings } = useBookings();

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      <header className="bg-white border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
              Calendar
            </h1>
          </div>

          <Popover
            trigger={<Button variant="ghost" size="sm"><Menu className="w-5 h-5" /></Button>}
            content={
              <div className="flex flex-col">
                <button className="px-4 py-2 text-sm text-left hover:bg-pink-50 transition-colors">Settings</button>
                <button className="px-4 py-2 text-sm text-left hover:bg-pink-50 transition-colors">Help</button>
                <button className="px-4 py-2 text-sm text-left hover:bg-pink-50 transition-colors text-red-500">Logout</button>
              </div>
            }
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Dashboard</h2>

          <div className="cq-wrapper w-full">
            <div className="cq-target bg-white p-4 rounded-xl shadow-sm border border-pink-100 transition-all">
              <div className="flex items-center gap-3 border-b border-pink-50 pb-3 mb-4">
                <Calendar className="w-5 h-5 text-pink-600" />
                <h3 className="font-bold text-pink-900">Your Booked Appointments</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-pink-50/30 border border-pink-100 hover:border-pink-200 transition-colors gap-3  "
                    >
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-semibold text-base">
                          {formatFullDate(booking.date)}
                        </span>
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-1">
                          Reserved by: {booking.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-pink-100 shadow-sm self-start sm:self-center">
                        <Clock className="w-4 h-4 text-pink-600" />
                        <span className="text-pink-600 font-bold text-lg leading-none">
                          {booking.slot}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic p-2">No terms reserved yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="flex flex-col">
            <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
            <div className="flex-1">
              <StatsChart />
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-lg font-medium mb-4 ">New Booking</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex-1">
              <BookingForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-pink-100 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Calendar
        </div>
      </footer>
    </div>
  );
}

export default App;