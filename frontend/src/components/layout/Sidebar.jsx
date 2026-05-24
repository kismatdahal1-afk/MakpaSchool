import { LayoutDashboard, Megaphone, NotebookPen, School, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const roleMenus = {
  admin: [
    { to: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/dashboard/admin#students", label: "Students", icon: Users },
    { to: "/dashboard/admin#teachers", label: "Teachers", icon: School },
    { to: "/dashboard/admin#notices", label: "Notices", icon: Megaphone },
  ],
  teacher: [
    { to: "/dashboard/teacher", label: "Overview", icon: LayoutDashboard },
    { to: "/dashboard/teacher#attendance", label: "Attendance", icon: NotebookPen },
    { to: "/dashboard/teacher#results", label: "Results", icon: School },
    { to: "/dashboard/teacher#notices", label: "Notices", icon: Megaphone },
  ],
  student: [
    { to: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
    { to: "/dashboard/student#attendance", label: "Attendance", icon: NotebookPen },
    { to: "/dashboard/student#results", label: "Results", icon: School },
    { to: "/dashboard/student#notices", label: "Notices", icon: Megaphone },
  ],
};

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
    isActive ? "bg-brand-100 text-brand-800" : "text-slate-600 hover:bg-slate-100"
  }`;

const Sidebar = () => {
  const { user } = useAuth();
  const menu = roleMenus[user?.role] || [];

  return (
    <aside className="h-full rounded-2xl border border-white/70 bg-white/80 p-3 shadow-soft">
      <p className="px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Workspace</p>
      <nav className="space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.label} to={item.to} className={linkClass}>
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
