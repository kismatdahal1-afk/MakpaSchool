import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="card-surface mx-auto max-w-xl space-y-4 p-8 text-center">
      <h1 className="font-display text-4xl font-bold text-slate-900">404</h1>
      <p className="text-slate-600">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="inline-flex rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
