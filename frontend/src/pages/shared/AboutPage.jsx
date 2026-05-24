const AboutPage = () => {
  return (
    <div className="card-surface space-y-5 p-8">
      <h1 className="font-display text-3xl font-bold text-slate-900">About MakpaSchool</h1>
      <p className="text-slate-600">
        MakpaSchool is a full-stack school management platform built to simplify the daily workflow of administrators,
        teachers, and students. It combines secure authentication, role-aware dashboards, and academic tools in one
        modern system.
      </p>
      <p className="text-slate-600">
        The platform is designed with scalability in mind using React, Express, MongoDB Atlas, and JWT-based
        authentication. This architecture allows institutions to start small and expand features as needed.
      </p>
      <p className="text-slate-600">
        Key goals are clarity, reliability, and speed, so school staff can spend more time supporting learners and
        less time handling repetitive administrative work.
      </p>
    </div>
  );
};

export default AboutPage;
