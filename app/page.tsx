import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            Agnos Frontend Assignment
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            A real-time patient input and staff monitoring system
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <Link
            href="/patient"
            className="block rounded-xl bg-black px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Patient Form
          </Link>

          <Link
            href="/staff"
            className="block rounded-xl border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-900 transition hover:bg-gray-50"
          >
            Staff View
          </Link>
        </div>
      </div>
    </main>
  );
}
