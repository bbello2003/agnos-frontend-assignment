import PatientForm from "@/components/patient/PatientForm";

export default function PatientPage() {
  return (
    <main className="min-h-dvh bg-gray-50 px-5 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="px-1 mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Patient Information
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Please provide your information. Your staff member will see updates
            in real time.
          </p>
        </div>

        <PatientForm />
      </div>
    </main>
  );
}
