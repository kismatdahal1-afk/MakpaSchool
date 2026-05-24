const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-[120px] items-center justify-center gap-3 rounded-2xl border border-brand-100 bg-white/80 p-6">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
      <p className="text-sm font-medium text-slate-600">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
