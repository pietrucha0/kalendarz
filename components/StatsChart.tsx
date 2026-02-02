import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/primitives";

const data = [
  { name: "Mon", bookings: 4 },
  { name: "Tue", bookings: 7 },
  { name: "Wed", bookings: 3 },
  { name: "Thu", bookings: 9 },
  { name: "Fri", bookings: 12 },
  { name: "Sat", bookings: 8 },
  { name: "Sun", bookings: 2 },
];

export const StatsChart = () => {
  return (
    <Card className="w-full h-[350px]">
      <CardHeader>
        <CardTitle>Weekly Booking Activity</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fce7f3" />
            <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#831843', fontSize: 12 }} 
            />
            <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#831843', fontSize: 12 }} 
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderColor: '#fbcfe8', borderRadius: '8px' }}
                itemStyle={{ color: '#db2777' }}
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#db2777"
              fillOpacity={1}
              fill="url(#colorBookings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
