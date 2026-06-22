export default function Loading() {
  return (
    <div className="min-h-screen p-grid-margin">
      <div className="flex justify-between items-end mb-12 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-white/20 rounded-full" />
          <div className="h-12 w-64 bg-white/20 rounded-[2.5rem]" />
          <div className="h-4 w-48 bg-white/20 rounded-full" />
        </div>
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full" />
          <div className="w-12 h-12 bg-white/20 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-grid-gutter">
        <div className="md:col-span-6 lg:col-span-8 h-96 bg-white/20 rounded-[2.5rem] animate-pulse" />
        <div className="md:col-span-3 lg:col-span-4 h-96 bg-white/20 rounded-[2.5rem] animate-pulse" />
        <div className="md:col-span-3 lg:col-span-4 h-72 bg-white/20 rounded-[2.5rem] animate-pulse" />
        <div className="md:col-span-6 lg:col-span-5 h-72 bg-white/20 rounded-[2.5rem] animate-pulse" />
        <div className="md:col-span-6 lg:col-span-3 flex flex-col gap-grid-gutter">
          <div className="flex-1 bg-white/20 rounded-[2.5rem] animate-pulse" />
          <div className="flex-1 bg-white/20 rounded-[2.5rem] animate-pulse" />
        </div>
      </div>
    </div>
  );
}