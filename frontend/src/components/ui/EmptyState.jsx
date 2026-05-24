const EmptyState = ({ title, subtitle }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
      <p className="font-display text-lg font-semibold text-slate-700">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
};

export default EmptyState;
