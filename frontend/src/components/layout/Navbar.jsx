import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-brand-100 text-brand-800" : "text-slate-600 hover:bg-slate-100"
  }`;

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-2xl font-bold text-brand-800">
          MakpaSchool
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={navClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navClass}>
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 sm:inline">
                {user?.role}
              </span>
              <Link
                to="/dashboard"
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
