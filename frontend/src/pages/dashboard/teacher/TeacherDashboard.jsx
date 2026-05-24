import { useEffect, useMemo, useState } from "react";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import FormInput from "../../../components/ui/FormInput.jsx";
import FormSelect from "../../../components/ui/FormSelect.jsx";
import LoadingSpinner from "../../../components/ui/LoadingSpinner.jsx";
import StatCard from "../../../components/ui/StatCard.jsx";
import { schoolService } from "../../../services/schoolService.js";

const defaultAttendanceForm = {
  studentId: "",
  className: "",
  date: "",
  status: "present",
  remarks: "",
};

const defaultResultForm = {
  studentId: "",
  subject: "",
  examName: "",
  marksObtained: "",
  maxMarks: "100",
  remarks: "",
};

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [results, setResults] = useState([]);
  const [notices, setNotices] = useState([]);

  const [attendanceForm, setAttendanceForm] = useState(defaultAttendanceForm);
  const [resultForm, setResultForm] = useState(defaultResultForm);

  useEffect(() => {
    const loadTeacherData = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsRes, studentsRes, attendanceRes, resultsRes, noticesRes] = await Promise.all([
          schoolService.getDashboardStats(),
          schoolService.getStudents(),
          schoolService.getAttendance(),
          schoolService.getResults(),
          schoolService.getNotices(),
        ]);

        setStats(statsRes.data.stats);
        setStudents(studentsRes.data.students || []);
        setAttendanceRecords(attendanceRes.data.attendanceRecords || []);
        setResults(resultsRes.data.results || []);
        setNotices(noticesRes.data.notices || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherData();
  }, [refreshKey]);

  const studentOptions = useMemo(
    () =>
      students.map((student) => ({
        value: student._id,
        label: `${student.className} - Roll ${student.rollNumber}`,
      })),
    [students]
  );

  const handleAttendanceSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await schoolService.saveAttendance({
        ...attendanceForm,
        date: attendanceForm.date || new Date().toISOString().slice(0, 10),
      });
      setAttendanceForm(defaultAttendanceForm);
      setSuccessMessage("Attendance saved successfully.");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResultSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await schoolService.createResult({
        ...resultForm,
        marksObtained: Number(resultForm.marksObtained),
        maxMarks: Number(resultForm.maxMarks),
      });
      setResultForm(defaultResultForm);
      setSuccessMessage("Result published successfully.");
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading teacher dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>
      ) : null}
      {successMessage ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assigned Classes" value={stats?.assignedClasses ?? 0} />
        <StatCard label="Students in Classes" value={stats?.studentsInAssignedClasses ?? 0} />
        <StatCard label="Today Attendance" value={stats?.todayAttendanceRecords ?? 0} />
        <StatCard label="Results Entered" value={stats?.resultsEntered ?? 0} />
      </section>

      <section id="attendance" className="card-surface space-y-4 p-5">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Attendance Tracking</h2>
        <form onSubmit={handleAttendanceSubmit} className="grid gap-3 md:grid-cols-3">
          <FormSelect
            label="Student"
            name="studentId"
            value={attendanceForm.studentId}
            onChange={(event) => setAttendanceForm((prev) => ({ ...prev, studentId: event.target.value }))}
            options={[{ value: "", label: "Select student" }, ...studentOptions]}
            required
          />
          <FormInput
            label="Class"
            name="className"
            value={attendanceForm.className}
            onChange={(event) => setAttendanceForm((prev) => ({ ...prev, className: event.target.value }))}
            required
          />
          <FormInput
            label="Date"
            name="date"
            type="date"
            value={attendanceForm.date}
            onChange={(event) => setAttendanceForm((prev) => ({ ...prev, date: event.target.value }))}
          />
          <FormSelect
            label="Status"
            name="status"
            value={attendanceForm.status}
            onChange={(event) => setAttendanceForm((prev) => ({ ...prev, status: event.target.value }))}
            options={[
              { value: "present", label: "Present" },
              { value: "absent", label: "Absent" },
              { value: "late", label: "Late" },
              { value: "excused", label: "Excused" },
            ]}
          />
          <FormInput
            label="Remarks"
            name="remarks"
            value={attendanceForm.remarks}
            onChange={(event) => setAttendanceForm((prev) => ({ ...prev, remarks: event.target.value }))}
          />
          <div className="md:col-span-3">
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Save Attendance
            </button>
          </div>
        </form>

        {attendanceRecords.length === 0 ? (
          <EmptyState title="No attendance records" subtitle="Your marked attendance records will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Class</th>
                  <th className="px-3 py-2">Roll</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.slice(0, 8).map((record) => (
                  <tr key={record._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{record.className}</td>
                    <td className="px-3 py-2">{record.student?.rollNumber || "-"}</td>
                    <td className="px-3 py-2">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-3 py-2 capitalize">{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section id="results" className="card-surface space-y-4 p-5">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Marks / Result System</h2>
        <form onSubmit={handleResultSubmit} className="grid gap-3 md:grid-cols-3">
          <FormSelect
            label="Student"
            name="studentId"
            value={resultForm.studentId}
            onChange={(event) => setResultForm((prev) => ({ ...prev, studentId: event.target.value }))}
            options={[{ value: "", label: "Select student" }, ...studentOptions]}
            required
          />
          <FormInput
            label="Subject"
            name="subject"
            value={resultForm.subject}
            onChange={(event) => setResultForm((prev) => ({ ...prev, subject: event.target.value }))}
            required
          />
          <FormInput
            label="Exam Name"
            name="examName"
            value={resultForm.examName}
            onChange={(event) => setResultForm((prev) => ({ ...prev, examName: event.target.value }))}
            required
          />
          <FormInput
            label="Marks Obtained"
            name="marksObtained"
            value={resultForm.marksObtained}
            onChange={(event) => setResultForm((prev) => ({ ...prev, marksObtained: event.target.value }))}
            required
          />
          <FormInput
            label="Max Marks"
            name="maxMarks"
            value={resultForm.maxMarks}
            onChange={(event) => setResultForm((prev) => ({ ...prev, maxMarks: event.target.value }))}
            required
          />
          <FormInput
            label="Remarks"
            name="remarks"
            value={resultForm.remarks}
            onChange={(event) => setResultForm((prev) => ({ ...prev, remarks: event.target.value }))}
          />
          <div className="md:col-span-3">
            <button
              type="submit"
              className="rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600"
            >
              Publish Result
            </button>
          </div>
        </form>

        {results.length === 0 ? (
          <EmptyState title="No results yet" subtitle="Published student scores will be listed here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Exam</th>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Marks</th>
                  <th className="px-3 py-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 8).map((result) => (
                  <tr key={result._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{result.examName}</td>
                    <td className="px-3 py-2">{result.subject}</td>
                    <td className="px-3 py-2">
                      {result.marksObtained}/{result.maxMarks}
                    </td>
                    <td className="px-3 py-2">{result.grade}</td>
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
          <EmptyState title="No active notices" subtitle="School announcements will show up here." />
        ) : (
          notices.slice(0, 6).map((notice) => (
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

export default TeacherDashboard;
