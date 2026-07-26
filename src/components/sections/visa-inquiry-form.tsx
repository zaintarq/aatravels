"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { VISIT_VISA_COUNTRIES } from "@/data/visit-visa-countries";

export function VisaInquiryForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [passportCountry, setPassportCountry] = useState("");
  const [visaCountry, setVisaCountry] = useState("");
  const [travelDates, setTravelDates] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/visa-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          whatsapp,
          passportCountry,
          visaCountry,
          travelDates,
          message,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not submit enquiry");

      setStatus("success");
      setFullName("");
      setEmail("");
      setWhatsapp("");
      setPassportCountry("");
      setVisaCountry("");
      setTravelDates("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-maroon-200 bg-maroon-50 p-8 text-center dark:border-maroon-800 dark:bg-maroon-950/30">
        <h3 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">Enquiry received</h3>
        <p className="mt-3 text-sm text-ink-600 dark:text-white/70">
          Thank you — our visa team will review your request and contact you shortly.
        </p>
        <Button className="mt-6" onClick={() => setStatus("idle")}>
          Submit another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-ink-900"
    >
      <div>
        <Label htmlFor="visaCountry">Which country visa do you need?</Label>
        <Select
          id="visaCountry"
          required
          value={visaCountry}
          onChange={(e) => setVisaCountry(e.target.value)}
        >
          <option value="">Select destination country</option>
          {VISIT_VISA_COUNTRIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.flag} {c.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="whatsapp">WhatsApp number</Label>
          <Input
            id="whatsapp"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+44 7900 000723"
          />
        </div>
        <div>
          <Label htmlFor="passportCountry">Your passport country</Label>
          <Input
            id="passportCountry"
            required
            value={passportCountry}
            onChange={(e) => setPassportCountry(e.target.value)}
            placeholder="e.g. United Kingdom"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="travelDates">Planned travel dates (optional)</Label>
        <Input
          id="travelDates"
          value={travelDates}
          onChange={(e) => setTravelDates(e.target.value)}
          placeholder="e.g. March 2026"
        />
      </div>

      <div>
        <Label htmlFor="message">Additional details (optional)</Label>
        <Textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Number of travellers, purpose of visit, any questions..."
        />
      </div>

      {error && <p className="text-sm text-maroon-500">{error}</p>}

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Sending..." : "Submit visa enquiry"}
      </Button>
    </form>
  );
}
