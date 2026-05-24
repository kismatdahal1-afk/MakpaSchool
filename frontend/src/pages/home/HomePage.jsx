import { GraduationCap, School, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: School,
    title: "Unified School Operations",
    text: "Manage students, teachers, attendance, notices, and exam results from one dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Security",
    text: "Admin, teacher, and student panels are protected with JWT authentication and role authorization.",
  },
  {
    icon: GraduationCap,
    title: "Progress Visibility",
    text: "Track attendance and performance trends with clear analytics and structured records.",
  },
];

const HomePage = () => {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-brand-100 via-white to-accent-100 p-8 shadow-soft sm:p-12">
        <Sparkles className="absolute -right-6 -top-6 h-28 w-28 text-brand-300" />
        <p className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
          School Management Platform
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
          MakpaSchool helps your school run smarter every day.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          A complete system to handle admissions, staff management, attendance, results, and communication with a
          modern and user-friendly interface.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="rounded-xl border border-brand-200 bg-white/80 px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Learn More
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="card-surface p-6">
              <div className="mb-4 inline-flex rounded-xl bg-brand-50 p-3 text-brand-700">
                <Icon size={20} />
              </div>
              <h2 className="font-display text-xl font-semibold text-slate-900">{feature.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.text}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default HomePage;
