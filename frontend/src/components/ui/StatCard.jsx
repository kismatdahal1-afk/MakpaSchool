const StatCard = ({ label, value, helper }) => {
  return (
    <article className="card-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">{label}</p>
      <p className="mt-3 font-display text-3xl font-bold text-slate-900">{value}</p>
      {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
    </article>
  );
};

export default StatCard;
