const Modal = ({ title, open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="font-display text-lg font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
