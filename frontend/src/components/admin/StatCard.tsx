type StatCardProps = {
  label: string;
  value: number;
  icon: string;
  color: string;
};

export default function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-on-surface">{value}</p>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-on-surface-variant mt-0.5">
          {label}
        </p>
      </div>
    </div>
  );
}
