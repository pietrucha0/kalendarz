import * as z from "zod";

// REACT HOOK FORM + ZOD REQUIREMENT 5: Regex and refine
const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

export const bookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().regex(phoneRegex, { message: "Invalid phone number format." }),
  date: z.date({ required_error: "A date is required." }),
  slot: z.string({ required_error: "Please select a time slot." }),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
  agreedToNotifications: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions."
  }),
  isHuman: z.boolean().refine((val) => val === true, {
    message: "Please confirm you are not a robot.",
  }),
  notes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export interface Booking extends BookingFormValues {
  id: string;
  createdAt: Date;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
