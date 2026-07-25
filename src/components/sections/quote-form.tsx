"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Send } from "lucide-react";
import { enquirySchema, type EnquiryInput } from "@/lib/validations";
import { Input, Select, Textarea, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function QuoteForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { adults: 1, children: 0, rooms: 1 },
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function onSubmit(data: EnquiryInput) {
    setStatus("idle");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset({ adults: 1, children: 0, rooms: 1 });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center rounded-2xl border border-maroon-200 bg-maroon-50 px-6 py-14 text-center dark:border-maroon-800 dark:bg-maroon-950/40"
      >
        <CheckCircle2 className="mb-4 text-maroon-500" size={40} />
        <h3 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">Request received</h3>
        <p className="mt-2 max-w-md text-sm text-ink-400 dark:text-white/60">
          Thank you — our team will send your quotation shortly. You can also message us on WhatsApp for faster replies.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="whatsapp" asChild>
            <a href="https://wa.me/447000000000" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </Button>
          <Button variant="outline" onClick={() => setStatus("idle")}>
            Send another request
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-maroon-500">Traveller details</p>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...register("fullName")} placeholder="Your full name" />
            <FieldError>{errors.fullName?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("country")} placeholder="United Kingdom" />
            <FieldError>{errors.country?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
            <FieldError>{errors.email?.message}</FieldError>
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input id="whatsapp" {...register("whatsapp")} placeholder="+44 7000 000000" />
            <FieldError>{errors.whatsapp?.message}</FieldError>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="agencyName">Agency Name <span className="normal-case tracking-normal text-ink-400">(optional)</span></Label>
            <Input id="agencyName" {...register("agencyName")} placeholder="If booking as a travel agent" />
          </div>
        </div>
      </div>

      <div className="border-t border-ink-900/10 pt-8 dark:border-white/10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-maroon-500">Trip preferences</p>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Select id="destination" {...register("destination")}>
              <option value="">Select destination</option>
              <option value="MAKKAH">Makkah</option>
              <option value="MADINAH">Madinah</option>
              <option value="BOTH">Both Makkah & Madinah</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="hotelCategory">Hotel Category</Label>
            <Select id="hotelCategory" {...register("hotelCategory")}>
              <option value="">Select category</option>
              <option value="THREE">3-Star</option>
              <option value="FOUR">4-Star</option>
              <option value="FIVE">5-Star</option>
              <option value="LUXURY_SUITE">Luxury Suite</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="checkIn">Check In</Label>
            <Input id="checkIn" type="date" {...register("checkIn")} />
          </div>
          <div>
            <Label htmlFor="checkOut">Check Out</Label>
            <Input id="checkOut" type="date" {...register("checkOut")} />
          </div>
          <div>
            <Label htmlFor="budget">Budget (per room/night)</Label>
            <Input id="budget" {...register("budget")} placeholder="e.g. £80–£120" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="adults">Adults</Label>
              <Input id="adults" type="number" min={1} {...register("adults")} />
            </div>
            <div>
              <Label htmlFor="children">Children</Label>
              <Input id="children" type="number" min={0} {...register("children")} />
            </div>
            <div>
              <Label htmlFor="rooms">Rooms</Label>
              <Input id="rooms" type="number" min={1} {...register("rooms")} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-900/10 pt-8 dark:border-white/10">
        <Label htmlFor="message">Anything else we should know?</Label>
        <Textarea
          id="message"
          rows={4}
          {...register("message")}
          placeholder="Group size, preferred hotel area, transport needs..."
          className="mt-1.5"
        />
      </div>

      {status === "error" && (
        <p className="text-sm font-medium text-maroon-500">
          Something went wrong. Please try again or contact us on WhatsApp.
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        <Send size={16} />
        {isSubmitting ? "Sending..." : "Request Quotation"}
      </Button>
    </form>
  );
}
