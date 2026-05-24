import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white/60 px-4 py-6 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} MakpaSchool. Built for modern school operations.
      </footer>
    </div>
  );
};

export default MainLayout;
