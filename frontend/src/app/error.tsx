'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="font-headline-md text-on-surface">Something went wrong</h2>
      <button onClick={reset} className="px-6 py-3 bg-primary text-white rounded-full">
        Try again
      </button>
    </div>
  );
}