import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 text-center">
          Agnos Frontend Developer Assignment
        </h1>

        <div className="mt-8 space-y-3">
          <Link
            href="/patient"
            className="block rounded-xl bg-black px-4 py-3 text-center font-medium text-white hover:bg-gray-800"
          >
            Patient Form
          </Link>

          <Link
            href="/staff"
            className="block rounded-xl border border-gray-300 px-4 py-3 text-center font-medium text-gray-900 hover:bg-gray-50"
          >
            Staff View
          </Link>
        </div>
      </div>
    </main>
  );
}
