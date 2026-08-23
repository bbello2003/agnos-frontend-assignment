import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const patientSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),

  middleName: z.string().trim().optional(),

  lastName: z.string().trim().min(1, "Last name is required"),

  dateOfBirth: z.string().min(1, "Date of birth is required"),

  gender: z.string().min(1, "Gender is required"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => isValidPhoneNumber(value), {
      message: "Invalid phone number",
    }),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  address: z.string().trim().min(1, "Address is required"),

  preferredLanguage: z.string().min(1, "Preferred language is required"),

  nationality: z.string().min(1, "Nationality is required"),

  emergencyContactName: z.string().trim().optional(),

  emergencyContactRelationship: z.string().trim().optional(),

  religion: z.string().trim().optional(),
});
