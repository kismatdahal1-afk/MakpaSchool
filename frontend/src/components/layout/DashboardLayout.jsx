import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Sidebar from "./Sidebar.jsx";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-50 bg-slate-950/30 p-4 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <div className="h-full w-[280px]" onClick={(event) => event.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        ) : null}

        <section className="space-y-4">
          <header className="glass flex items-center justify-between rounded-2xl border border-white/70 px-4 py-3 shadow-soft">
            <div>
              <h1 className="font-display text-xl font-bold text-slate-900">Welcome, {user?.name}</h1>
              <p className="text-sm text-slate-600">
                Role: <span className="font-semibold capitalize">{user?.role}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={18} />
              </button>
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          </header>

          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;
