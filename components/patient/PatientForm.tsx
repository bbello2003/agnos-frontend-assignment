"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { patientSchema } from "@/lib/validation";
import type { Patient } from "@/types/patient";

export default function PatientForm() {
  const {
    register,
    handleSubmit,
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

  const onSubmit = (data: Patient) => {
    console.log("Patient data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Information */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              placeholder="Enter first name"
            />

            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              placeholder="Enter middle name"
            />
          </div>

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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              placeholder="Enter last name"
            />

            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>

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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />

            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-500">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

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
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
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

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Phone Number *
            </label>

            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              placeholder="Enter phone number"
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              placeholder="Enter email"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="nationality"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Nationality *
            </label>

            <input
              id="nationality"
              type="text"
              {...register("nationality")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              placeholder="Enter nationality"
            />

            {errors.nationality && (
              <p className="mt-1 text-sm text-red-500">
                {errors.nationality.message}
              </p>
            )}
          </div>

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
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
            >
              <option value="">Select language</option>
              <option value="english">English</option>
              <option value="thai">Thai</option>
              <option value="chinese">Chinese</option>
              <option value="japanese">Japanese</option>
              <option value="other">Other</option>
            </select>

            {errors.preferredLanguage && (
              <p className="mt-1 text-sm text-red-500">
                {errors.preferredLanguage.message}
              </p>
            )}
          </div>

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
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
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

        <p className="mt-1 text-sm text-gray-500">Optional</p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              placeholder="Enter emergency contact name"
            />
          </div>

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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              placeholder="e.g. Parent, Spouse"
            />
          </div>
        </div>
      </section>

      {/* Other Information */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Other Information
        </h2>

        <div className="mt-6">
          <label
            htmlFor="religion"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Religion
          </label>

          <input
            id="religion"
            type="text"
            {...register("religion")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            placeholder="Enter religion"
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 md:w-auto"
        >
          Submit Information
        </button>
      </div>
    </form>
  );
}
