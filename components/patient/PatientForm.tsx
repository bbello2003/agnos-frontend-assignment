"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-number-input";

import { patientSchema } from "@/lib/validation";
import { supabase } from "@/lib/supabase";
import {
  PATIENT_CHANNEL,
  PATIENT_UPDATE_EVENT,
  PATIENT_RESET_EVENT,
} from "@/lib/realtime";

import type { Patient } from "@/types/patient";
import type { Country } from "@/types/country";
import type { Language } from "@/types/language";

const inputClassName =
  "h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-900 outline-none transition focus:border-black placeholder:text-gray-400";

const selectClassName =
  "h-12 w-full rounded-xl border border-gray-300 bg-white px-3 outline-none transition focus:border-black";

const textareaClassName =
  "w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-black placeholder:text-gray-400";

export default function PatientForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Patient>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      preferredLanguage: "",
      nationality: "",
      emergencyContactName: "",
      emergencyContactRelationship: "",
      religion: "",
    },
  });

  const patient = useWatch({ control });

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const hasSubmittedRef = useRef(false);

  const [isConnected, setIsConnected] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  const hasPatientInput = Object.values(patient).some(
    (value) => typeof value === "string" && value.trim() !== "",
  );

  const onSubmit = async (data: Patient) => {
    const channel = channelRef.current;

    if (!channel) {
      console.error("Realtime channel is not connected");
      return;
    }

    hasSubmittedRef.current = true;

    const result = await channel.send({
      type: "broadcast",
      event: PATIENT_UPDATE_EVENT,
      payload: {
        patient: data,
        status: "submitted",
        updatedAt: new Date().toISOString(),
      },
    });

    console.log("Submit result:", result);
    console.log("Patient submitted:", data);
  };

  useEffect(() => {
    const channel = supabase.channel(PATIENT_CHANNEL);

    channelRef.current = channel;

    channel.subscribe((status, error) => {
      console.log("Patient Realtime status:", status);

      if (error) {
        console.error("Patient Realtime error:", error);
      }

      if (status === "SUBSCRIBED") {
        setIsConnected(true);

        channel.send({
          type: "broadcast",
          event: PATIENT_RESET_EVENT,
          payload: {
            updatedAt: new Date().toISOString(),
          },
        });

        console.log("Patient Realtime connected ✅");
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setIsConnected(false);
      }
    });

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isConnected || hasSubmittedRef.current || !hasPatientInput) {
      return;
    }

    const channel = channelRef.current;

    if (!channel) {
      return;
    }

    channel.send({
      type: "broadcast",
      event: PATIENT_UPDATE_EVENT,
      payload: {
        patient,
        status: "active",
        updatedAt: new Date().toISOString(),
      },
    });
  }, [patient, isConnected, hasPatientInput]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          "https://countries.dev/countries?fields=name,alpha2Code,flag,languages&sort=name",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch country data");
        }

        const data: Country[] = await response.json();

        setCountries(data);

        const languageMap = new Map<string, Language>();

        data.forEach((country) => {
          country.languages?.forEach((language) => {
            if (language.iso639_1 && !languageMap.has(language.iso639_1)) {
              languageMap.set(language.iso639_1, language);
            }
          });
        });

        const uniqueLanguages = Array.from(languageMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        setLanguages(uniqueLanguages);
      } catch (error) {
        console.error("Failed to load countries/languages:", error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Information */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              First Name *
            </label>

            <input
              id="firstName"
              type="text"
              {...register("firstName")}
              className={inputClassName}
              placeholder="Enter first name"
            />

            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Middle Name */}
          <div>
            <label
              htmlFor="middleName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Middle Name
            </label>

            <input
              id="middleName"
              type="text"
              {...register("middleName")}
              className={inputClassName}
              placeholder="Enter middle name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Last Name *
            </label>

            <input
              id="lastName"
              type="text"
              {...register("lastName")}
              className={inputClassName}
              placeholder="Enter last name"
            />

            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label
              htmlFor="dateOfBirth"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Date of Birth *
            </label>

            <input
              id="dateOfBirth"
              type="date"
              {...register("dateOfBirth")}
              className={`${selectClassName} ${
                patient.dateOfBirth ? "text-gray-900" : "text-gray-400"
              }`}
            />

            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-500">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Gender *
            </label>

            <select
              id="gender"
              {...register("gender")}
              className={`${selectClassName} ${
                patient.gender ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>

            {errors.gender && (
              <p className="mt-1 text-sm text-red-500">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Phone Number *
            </label>

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  id="phone"
                  international
                  defaultCountry="TH"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className={`phone-input ${
                    field.value ? "phone-input-filled" : ""
                  }`}
                  placeholder="Enter phone number"
                />
              )}
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email *
            </label>

            <input
              id="email"
              type="email"
              {...register("email")}
              className={inputClassName}
              placeholder="Enter email"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Nationality */}
          <div>
            <label
              htmlFor="nationality"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Nationality *
            </label>

            <select
              id="nationality"
              {...register("nationality")}
              className={`${selectClassName} ${
                patient.nationality ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <option value="">Select nationality</option>

              {countries.map((country) => (
                <option key={country.alpha2Code} value={country.name}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>

            {errors.nationality && (
              <p className="mt-1 text-sm text-red-500">
                {errors.nationality.message}
              </p>
            )}
          </div>

          {/* Preferred Language */}
          <div>
            <label
              htmlFor="preferredLanguage"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Preferred Language *
            </label>

            <select
              id="preferredLanguage"
              {...register("preferredLanguage")}
              className={`${selectClassName} ${
                patient.preferredLanguage ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <option value="">Select language</option>

              {languages.map((language) => (
                <option key={language.iso639_1} value={language.name}>
                  {language.name}
                </option>
              ))}
            </select>

            {errors.preferredLanguage && (
              <p className="mt-1 text-sm text-red-500">
                {errors.preferredLanguage.message}
              </p>
            )}
          </div>

          {/* Religion */}
          <div>
            <label
              htmlFor="religion"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Religion
            </label>

            <select
              id="religion"
              {...register("religion")}
              className={`${selectClassName} ${
                patient.religion ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <option value="">Select religion</option>
              <option value="Buddhism">Buddhism</option>
              <option value="Christianity">Christianity</option>
              <option value="Islam">Islam</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Address *
            </label>

            <textarea
              id="address"
              {...register("address")}
              rows={4}
              className={textareaClassName}
              placeholder="Enter address"
            />

            {errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Emergency Contact
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Emergency Contact Name */}
          <div>
            <label
              htmlFor="emergencyContactName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="emergencyContactName"
              type="text"
              {...register("emergencyContactName")}
              className={inputClassName}
              placeholder="Enter emergency contact name"
            />
          </div>

          {/* Relationship */}
          <div>
            <label
              htmlFor="emergencyContactRelationship"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Relationship
            </label>

            <input
              id="emergencyContactRelationship"
              type="text"
              {...register("emergencyContactRelationship")}
              className={inputClassName}
              placeholder="e.g. Parent, Spouse"
            />
          </div>
        </div>
      </section>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full rounded-xl bg-black px-6 py-3 font-bold text-white transition hover:bg-gray-800 md:w-auto"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
