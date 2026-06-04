export default function LoadingSkeleton({ cards = 4 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-[28px] bg-white p-4 shadow-panel">
          <div className="h-52 rounded-3xl bg-slate-200" />
          <div className="mt-4 h-5 rounded-full bg-slate-200" />
          <div className="mt-2 h-4 w-3/4 rounded-full bg-slate-200" />
          <div className="mt-6 h-10 rounded-full bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
