import React from "react";
import { BookingForm } from "./components/BookingForm";
import { StatsChart } from "./components/StatsChart";
import { Popover } from "./components/ui/tooltip";
import { Button, Card, CardContent, CardHeader, CardTitle } from "./components/ui/primitives";
import { GenericList } from "./components/GenericList";
import { Menu, Calendar } from "lucide-react";
import { cn, formatDate } from "./utils/helpers";
import { useBookings } from "./context/BookingContext";
import { Booking } from "./lib/validation";

function App() {
  const { bookings } = useBookings();
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-pink-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              PinkScheduler
            </h1>
          </div>
          
          {/* SHADCN REQUIREMENT 4: Popover / Dropdown Menu */}
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

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Intro Section with Container Query Demo */}
        <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-800">Dashboard</h2>
            
            {/* TAILWINDCSS REQUIREMENT 6: Container Query Wrapper (.cq-wrapper defined in index.html) */}
            <div className="cq-wrapper w-full p-1">
                {/* 
                   The .cq-target class changes layout based on container width defined in index.html CSS 
                   Resize window to see effect: text gets larger, flex direction changes
                */}
                <div className="cq-target flex flex-col gap-4 bg-white p-6 rounded-xl shadow-sm border border-pink-100 transition-all">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 shrink-0">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="cq-target-text font-bold text-pink-900">Welcome back, Admin!</h3>
                        <p className="text-slate-500 text-sm mt-1">
                          You have {confirmedCount} confirmed bookings.
                        </p>
                    </div>
                    <div className="ml-auto">
                        <Button size="sm">View All</Button>
                    </div>
                </div>
            </div>
        </section>

        {/* Analytics Section */}
        <section className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Quick Stats</h3>
                    <StatsChart />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Recent Bookings</h3>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Latest Reservations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <GenericList<Booking>
                          items={bookings.slice(-3).reverse()} 
                          keyExtractor={(item) => item.id}
                          emptyMessage="No bookings yet."
                          renderItem={(booking) => (
                            <div className="flex items-center justify-between p-2 border-b last:border-0 border-gray-100">
                              <div className="flex flex-col">
                                <span className="font-medium text-sm text-slate-800">{booking.name}</span>
                                <span className="text-xs text-slate-500">{formatDate(booking.date)}</span>
                              </div>
                              <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                                {booking.slot}
                              </span>
                            </div>
                          )}
                        />
                      </CardContent>
                    </Card>
                </div>
            </div>
            
            <div className="lg:col-span-2">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">New Booking</h3>
                    <BookingForm />
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100 py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} PinkScheduler Inc. All rights reserved.
          </div>
      </footer>
    </div>
  );
}

export default App;