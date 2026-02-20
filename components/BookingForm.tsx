import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingFormValues } from "../lib/validation";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/primitives";
import { Calendar } from "./CompoundCalendar";
import { GenericList } from "./GenericList";
import { cn, formatDate } from "../utils/helpers";
import { Steps } from "../types";
import { Check, User, Clock, Calendar as CalendarIcon, ShieldCheck } from "lucide-react";
import { Tooltip } from "./ui/tooltip";
import { useBookings } from "../context/BookingContext";
import ReCAPTCHA from "react-google-recaptcha";


const AVAILABLE_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

// REACT HOOK FORM REQUIREMENT 4: Custom Form Control (ReCAPTCHA Mock)
const RecaptchaMock = ({ value, onChange, error }: { value: boolean; onChange: (v: boolean) => void; error?: string }) => (
  <div className="space-y-2">
    <div
      className={cn(
        "flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-all w-fit",
        value ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 hover:border-gray-300"
      )}
      onClick={() => onChange(!value)}
    >
      <div className={cn("w-6 h-6 border-2 rounded flex items-center justify-center bg-white", value ? "border-green-500" : "border-gray-400")}>
        {value && <Check className="w-4 h-4 text-green-500" />}
      </div>
      <span className="text-sm font-medium text-gray-700">I'm not a robot</span>
      <ShieldCheck className="w-5 h-5 text-gray-400 ml-2" />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);


export const BookingForm = () => {
  const [step, setStep] = useState<Steps>(Steps.DATE_SELECTION);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addBooking, isSlotTaken } = useBookings();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  // REACT HOOK FORM REQUIREMENT 1 & 2: useForm + Zod Resolver
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      agreedToTerms: false,
      agreedToNotifications: false,
      date: undefined,
      slot: "",
    },
  });

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isValid },
    reset
  } = form;

  const selectedDate = watch("date");
  const selectedSlot = watch("slot");

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];

    if (step === Steps.DATE_SELECTION) {
      fieldsToValidate = ["date", "slot"];
    } else if (step === Steps.DETAILS_FORM) {
      // Musimy sprawdzić wszystkie pola z kroku 2 przed przejściem do kroku 3
      fieldsToValidate = ["name", "email", "phone", "agreedToTerms", "agreedToNotifications", "captchaToken"];
    }

    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };
  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = (data: BookingFormValues) => {
    addBooking(data);
    setShowSuccess(true);
  };

  const handleBookAnother = () => {
    reset({
      name: "",
      email: "",
      phone: "",
      agreedToTerms: false,
      agreedToNotifications: false,
      date: undefined,
      slot: "",
    });
    setStep(Steps.DATE_SELECTION);
    setShowSuccess(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-pink-100 -z-10" />
        {[0, 1, 2].map((s) => (
          <div key={s} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-white transition-colors",
            step >= s ? "border-pink-600 text-pink-600" : "border-gray-300 text-gray-400"
          )}>
            {s + 1}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* STEP 0: DATE & SLOT */}
        {step === Steps.DATE_SELECTION && (
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarIcon className="w-5 h-5" /> Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <Calendar.Root selectedDate={field.value} onDateSelect={(date) => {
                      field.onChange(date);
                      setValue("slot", ""); // Reset slot on date change
                    }} className="w-full">
                      <Calendar.Header />
                      <Calendar.Grid />
                    </Calendar.Root>
                  )}
                />
                {errors.date && <p className="text-sm text-red-500 mt-2">{errors.date.message}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" /> Select Time Slot</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  /* GENERIC COMPONENT USAGE */
                  <GenericList
                    items={AVAILABLE_SLOTS}
                    keyExtractor={(item) => item}
                    renderItem={(slot) => {
                      const isTaken = isSlotTaken(selectedDate, slot);
                      return (
                        <button
                          type="button"
                          disabled={isTaken}
                          onClick={() => setValue("slot", slot, { shouldValidate: true })}
                          // TAILWINDCSS REQUIREMENT 4: Group Usage
                          className={cn(
                            "w-full group flex items-center justify-between p-3 border rounded-md transition-all",
                            isTaken ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-100" : "cursor-pointer",
                            !isTaken && selectedSlot === slot
                              ? "border-pink-500 bg-pink-50 text-pink-700"
                              : !isTaken && "border-gray-200 hover:border-pink-300 hover:shadow-sm"
                          )}
                        >
                          <span className={cn("font-medium", isTaken && "text-gray-400 line-through")}>{slot}</span>
                          {/* TAILWINDCSS REQUIREMENT 4: Group Hover */}
                          <div className={cn(
                            "w-3 h-3 rounded-full border border-pink-300 transition-colors",
                            !isTaken && "group-hover:bg-pink-300",
                            selectedSlot === slot ? "bg-pink-600 border-pink-600" : ""
                          )} />
                        </button>
                      );
                    }}
                  />
                ) : (
                  <p className="text-center text-gray-400 italic py-8">Please select a date first.</p>
                )}
                {errors.slot && <p className="text-sm text-red-500 mt-2">{errors.slot.message}</p>}
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 1: DETAILS */}
        {step === Steps.DETAILS_FORM && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Your Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Tooltip content="Format: John Doe">
                    <Input {...form.register("name")} id="name" placeholder="John Doe" />
                  </Tooltip>
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Tooltip content="Format: JohnDoe@email.com">
                    <Input {...form.register("email")} id="email" placeholder="john@example.com" />
                  </Tooltip>
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Tooltip content="Format: 123456789">
                    <Input {...form.register("phone")} id="phone" placeholder="+1 234 567 890" />
                  </Tooltip>
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-pink-100 flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    {...form.register("agreedToTerms")}
                    className="rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                  />
                  <Label htmlFor="terms">I agree to the Terms & Conditions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notifications"
                    {...form.register("agreedToNotifications")}
                    className="rounded border-pink-300 text-pink-600 focus:ring-pink-500"
                  />
                  <Label htmlFor="notifications">I agree to receive booking details and reminders at the email address provided.</Label>
                </div>
                <div>
                  <Controller
                    control={control}
                    name="captchaToken"
                    render={({ field }) => (
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        onChange={(value) => field.onChange(value)} // Przekazuje token do react-hook-form
                      />
                    )}
                  />
                  {errors.captchaToken && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.captchaToken.message}
                    </p>
                  )}
                </div>
                {(errors.agreedToTerms || errors.agreedToNotifications) && (
                  <p className="text-xs text-red-500">
                    <p className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                      {errors.agreedToTerms?.message || errors.agreedToNotifications?.message}
                    </p>
                  </p>
                )}
              </div>


            </CardContent>
          </Card>
        )}

        {/* STEP 2: CONFIRMATION (Read Only Review) */}
        {step === Steps.CONFIRMATION && (
          <Card className="animate-fade-in bg-pink-50/50">
            <CardHeader>
              <CardTitle>Confirm Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-gray-500">Date:</div>
                <div className="font-medium text-gray-900">{selectedDate ? formatDate(selectedDate) : '-'}</div>

                <div className="text-gray-500">Time:</div>
                <div className="font-medium text-gray-900">{selectedSlot}</div>

                <div className="text-gray-500">Name:</div>
                <div className="font-medium text-gray-900">{watch('name')}</div>

                <div className="text-gray-500">Email:</div>
                <div className="font-medium text-gray-900">{watch('email')}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 0 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
          )}

          {step < Steps.CONFIRMATION ? (
            <Button type="button" onClick={nextStep} className="ml-auto">
              Next Step
            </Button>
          ) : (
            <Button type="submit" className="ml-auto bg-pink-600 hover:bg-pink-700">
              Confirm Booking
            </Button>
          )}
        </div>
      </form>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center justify-center gap-2">
              <Check className="w-6 h-6" /> Booking Confirmed!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-600">Thank you, {watch('name')}.</p>
            <p className="text-sm text-gray-500 mt-2">We have sent a confirmation email to {watch('email')}.</p>
            <Button className="mt-6 w-full" onClick={handleBookAnother}>Book Another</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
