import StaffView from "@/components/staff/StaffView";

export default function StaffPage() {
  return (
    <main className="min-h-dvh bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="px-1 mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Staff View
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Monitor patient information and activity in real time.
          </p>
        </div>

        <StaffView />
      </div>
    </main>
  );
}
