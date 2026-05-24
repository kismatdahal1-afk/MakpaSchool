import { useEffect, useState } from "react";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import LoadingSpinner from "../../../components/ui/LoadingSpinner.jsx";
import StatCard from "../../../components/ui/StatCard.jsx";
import { schoolService } from "../../../services/schoolService.js";

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [results, setResults] = useState([]);
  const [notices, setNotices] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadStudentData = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsRes, attendanceRes, resultRes, noticesRes] = await Promise.all([
          schoolService.getDashboardStats(),
          schoolService.getAttendance(),
          schoolService.getResults(),
          schoolService.getNotices(),
        ]);

        setStats(statsRes.data.stats);
        setProfile(statsRes.data.profile || null);
        setAttendanceRecords(attendanceRes.data.attendanceRecords || []);
        setResults(resultRes.data.results || []);
        setNotices(noticesRes.data.notices || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading student dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>
      ) : null}

      <section className="card-surface p-5">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Your Profile</h2>
        <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <p>
            <span className="font-semibold">Class:</span> {profile?.className || "-"}
          </p>
          <p>
            <span className="font-semibold">Roll Number:</span> {profile?.rollNumber || "-"}
          </p>
          <p>
            <span className="font-semibold">Guardian:</span> {profile?.guardianName || "-"}
          </p>
          <p>
            <span className="font-semibold">Guardian Phone:</span> {profile?.guardianPhone || "-"}
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Attendance Records" value={stats?.totalAttendanceRecords ?? 0} />
        <StatCard label="Attendance Rate" value={`${stats?.attendanceRate ?? 0}%`} />
        <StatCard label="Results Published" value={stats?.resultsPublished ?? 0} />
        <StatCard label="Average Score" value={`${stats?.averageScore ?? 0}%`} />
      </section>

      <section id="attendance" className="card-surface space-y-3 p-5">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Attendance</h2>
        {attendanceRecords.length === 0 ? (
          <EmptyState title="No attendance records found" subtitle="Your attendance entries will be shown here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Class</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{record.className}</td>
                    <td className="px-3 py-2 capitalize">{record.status}</td>
                    <td className="px-3 py-2">{record.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section id="results" className="card-surface space-y-3 p-5">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Exam Results</h2>
        {results.length === 0 ? (
          <EmptyState title="No result records found" subtitle="Published marks will appear in this section." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Exam</th>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Marks</th>
                  <th className="px-3 py-2">Grade</th>
                  <th className="px-3 py-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{result.examName}</td>
                    <td className="px-3 py-2">{result.subject}</td>
                    <td className="px-3 py-2">
                      {result.marksObtained}/{result.maxMarks}
                    </td>
                    <td className="px-3 py-2">{result.grade}</td>
                    <td className="px-3 py-2">{result.remarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section id="notices" className="card-surface space-y-3 p-5">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Notice Board</h2>
        {notices.length === 0 ? (
          <EmptyState title="No active notices" subtitle="School announcements will appear here." />
        ) : (
          notices.map((notice) => (
            <article key={notice._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{notice.title}</h3>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase text-brand-700">
                  {notice.audience}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{notice.message}</p>
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
