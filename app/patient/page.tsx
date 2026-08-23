import PatientForm from "@/components/patient/PatientForm";

export default function PatientPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900">
          Patient Information
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Please fill in your information
        </p>

        <div className="mt-8">
          <PatientForm />
        </div>
      </div>
    </main>
  );
}
