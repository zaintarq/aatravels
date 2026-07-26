import { z } from "zod";

export const enquirySchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  country: z.string().min(2, "Please select your country"),
  agencyName: z.string().optional(),
  whatsapp: z.string().min(7, "Please enter a valid WhatsApp number"),
  email: z.string().email("Please enter a valid email"),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  destination: z.enum(["MAKKAH", "MADINAH", "BOTH"]).optional(),
  hotelCategory: z.enum(["THREE", "FOUR", "FIVE", "LUXURY_SUITE"]).optional(),
  budget: z.string().optional(),
  adults: z.coerce.number().min(1).default(1),
  children: z.coerce.number().min(0).default(0),
  rooms: z.coerce.number().min(1).default(1),
  message: z.string().optional(),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

export const travelAgentSchema = z.object({
  agencyName: z.string().min(2, "Agency name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  country: z.string().min(2, "Please select your country"),
  website: z.string().url().optional().or(z.literal("")),
  yearsTrading: z.coerce.number().min(0).optional(),
  message: z.string().optional(),
});
export type TravelAgentInput = z.infer<typeof travelAgentSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Please tell us a little more"),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const visaEnquirySchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  whatsapp: z.string().min(7, "Please enter a valid WhatsApp number"),
  passportCountry: z.string().min(2, "Please enter your passport country"),
  visaCountry: z.enum([
    "malaysia",
    "thailand",
    "singapore",
    "indonesia",
    "uzbekistan",
    "tajikistan",
    "cambodia",
    "baku",
    "kenya",
    "nepal",
  ]),
  travelDates: z.string().optional(),
  message: z.string().optional(),
});
export type VisaEnquiryInput = z.infer<typeof visaEnquirySchema>;

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
