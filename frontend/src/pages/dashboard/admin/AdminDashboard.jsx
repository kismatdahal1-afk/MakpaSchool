import { useEffect, useState } from "react";
import EmptyState from "../../../components/ui/EmptyState.jsx";
import FormInput from "../../../components/ui/FormInput.jsx";
import LoadingSpinner from "../../../components/ui/LoadingSpinner.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import StatCard from "../../../components/ui/StatCard.jsx";
import { schoolService } from "../../../services/schoolService.js";

const defaultStudentForm = {
  className: "",
  rollNumber: "",
  attendanceRate: "",
  overallMarks: "",
  guardianName: "",
  guardianPhone: "",
};

const defaultTeacherForm = {
  subject: "",
  employeeId: "",
  assignedClasses: "",
  phone: "",
};

const defaultNoticeForm = {
  title: "",
  message: "",
  audience: "all",
  targetRoles: "",
  expiresAt: "",
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [notices, setNotices] = useState([]);

  const [studentForm, setStudentForm] = useState(defaultStudentForm);
  const [teacherForm, setTeacherForm] = useState(defaultTeacherForm);
  const [noticeForm, setNoticeForm] = useState(defaultNoticeForm);

  const [savingStudent, setSavingStudent] = useState(false);
  const [savingTeacher, setSavingTeacher] = useState(false);
  const [savingNotice, setSavingNotice] = useState(false);

  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editStudentForm, setEditStudentForm] = useState(defaultStudentForm);
  const [editTeacherForm, setEditTeacherForm] = useState(defaultTeacherForm);

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsRes, studentsRes, teachersRes, noticesRes] = await Promise.all([
          schoolService.getDashboardStats(),
          schoolService.getStudents(),
          schoolService.getTeachers(),
          schoolService.getNotices(),
        ]);
        setStats(statsRes.data.stats);
        setStudents(studentsRes.data.students || []);
        setTeachers(teachersRes.data.teachers || []);
        setNotices(noticesRes.data.notices || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [refreshKey]);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleStudentSubmit = async (event) => {
    event.preventDefault();
    setSavingStudent(true);
    setError("");
    try {
      await schoolService.createStudent({
        ...studentForm,
        rollNumber: Number(studentForm.rollNumber),
        attendanceRate: Number(studentForm.attendanceRate || 0),
        overallMarks: Number(studentForm.overallMarks || 0),
      });
      setStudentForm(defaultStudentForm);
      triggerRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingStudent(false);
    }
  };

  const handleTeacherSubmit = async (event) => {
    event.preventDefault();
    setSavingTeacher(true);
    setError("");
    try {
      await schoolService.createTeacher({
        ...teacherForm,
        assignedClasses: teacherForm.assignedClasses
          ? teacherForm.assignedClasses.split(",").map((item) => item.trim())
          : [],
      });
      setTeacherForm(defaultTeacherForm);
      triggerRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingTeacher(false);
    }
  };

  const handleNoticeSubmit = async (event) => {
    event.preventDefault();
    setSavingNotice(true);
    setError("");
    try {
      await schoolService.createNotice({
        ...noticeForm,
        targetRoles: noticeForm.targetRoles
          ? noticeForm.targetRoles.split(",").map((role) => role.trim())
          : [],
        expiresAt: noticeForm.expiresAt || undefined,
      });
      setNoticeForm(defaultNoticeForm);
      triggerRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingNotice(false);
    }
  };

  const deleteRecord = async (type, id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      if (type === "student") await schoolService.deleteStudent(id);
      if (type === "teacher") await schoolService.deleteTeacher(id);
      if (type === "notice") await schoolService.deleteNotice(id);
      triggerRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const openStudentEditModal = (student) => {
    setEditingStudent(student);
    setEditStudentForm({
      className: student.className || "",
      rollNumber: String(student.rollNumber || ""),
      attendanceRate: String(student.attendanceRate ?? ""),
      overallMarks: String(student.overallMarks ?? ""),
      guardianName: student.guardianName || "",
      guardianPhone: student.guardianPhone || "",
    });
  };

  const openTeacherEditModal = (teacher) => {
    setEditingTeacher(teacher);
    setEditTeacherForm({
      subject: teacher.subject || "",
      employeeId: teacher.employeeId || "",
      assignedClasses: teacher.assignedClasses?.join(", ") || "",
      phone: teacher.phone || "",
    });
  };

  const saveStudentEdit = async (event) => {
    event.preventDefault();
    if (!editingStudent) return;
    try {
      await schoolService.updateStudent(editingStudent._id, {
        ...editStudentForm,
        rollNumber: Number(editStudentForm.rollNumber),
        attendanceRate: Number(editStudentForm.attendanceRate || 0),
        overallMarks: Number(editStudentForm.overallMarks || 0),
      });
      setEditingStudent(null);
      triggerRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const saveTeacherEdit = async (event) => {
    event.preventDefault();
    if (!editingTeacher) return;
    try {
      await schoolService.updateTeacher(editingTeacher._id, {
        ...editTeacherForm,
        assignedClasses: editTeacherForm.assignedClasses
          ? editTeacherForm.assignedClasses.split(",").map((item) => item.trim())
          : [],
      });
      setEditingTeacher(null);
      triggerRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard label="Students" value={stats?.totalStudents ?? 0} />
        <StatCard label="Teachers" value={stats?.totalTeachers ?? 0} />
        <StatCard label="Notices" value={stats?.totalNotices ?? 0} />
        <StatCard label="Today Attendance" value={stats?.todayAttendanceRecords ?? 0} />
        <StatCard label="Present Today" value={stats?.presentToday ?? 0} />
      </section>

      <section id="students" className="card-surface space-y-4 p-5">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Student Management</h2>
        <form onSubmit={handleStudentSubmit} className="grid gap-3 md:grid-cols-3">
          <FormInput
            label="Class"
            name="className"
            value={studentForm.className}
            onChange={(event) => setStudentForm((prev) => ({ ...prev, className: event.target.value }))}
            required
          />
          <FormInput
            label="Roll Number"
            name="rollNumber"
            value={studentForm.rollNumber}
            onChange={(event) => setStudentForm((prev) => ({ ...prev, rollNumber: event.target.value }))}
            required
          />
          <FormInput
            label="Attendance %"
            name="attendanceRate"
            value={studentForm.attendanceRate}
            onChange={(event) => setStudentForm((prev) => ({ ...prev, attendanceRate: event.target.value }))}
          />
          <FormInput
            label="Overall Marks %"
            name="overallMarks"
            value={studentForm.overallMarks}
            onChange={(event) => setStudentForm((prev) => ({ ...prev, overallMarks: event.target.value }))}
          />
          <FormInput
            label="Guardian Name"
            name="guardianName"
            value={studentForm.guardianName}
            onChange={(event) => setStudentForm((prev) => ({ ...prev, guardianName: event.target.value }))}
          />
          <FormInput
            label="Guardian Phone"
            name="guardianPhone"
            value={studentForm.guardianPhone}
            onChange={(event) => setStudentForm((prev) => ({ ...prev, guardianPhone: event.target.value }))}
          />
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={savingStudent}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:bg-brand-300"
            >
              {savingStudent ? "Saving..." : "Add Student"}
            </button>
          </div>
        </form>

        {students.length === 0 ? (
          <EmptyState title="No students yet" subtitle="Create the first student record using the form above." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Student User</th>
                  <th className="px-3 py-2">Class</th>
                  <th className="px-3 py-2">Roll</th>
                  <th className="px-3 py-2">Attendance</th>
                  <th className="px-3 py-2">Marks</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{student.user?.name || "Unlinked"}</td>
                    <td className="px-3 py-2">{student.className}</td>
                    <td className="px-3 py-2">{student.rollNumber}</td>
                    <td className="px-3 py-2">{student.attendanceRate ?? 0}%</td>
                    <td className="px-3 py-2">{student.overallMarks ?? 0}%</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openStudentEditModal(student)}
                          className="rounded-lg border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRecord("student", student._id)}
                          className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section id="teachers" className="card-surface space-y-4 p-5">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Teacher Management</h2>
        <form onSubmit={handleTeacherSubmit} className="grid gap-3 md:grid-cols-3">
          <FormInput
            label="Subject"
            name="subject"
            value={teacherForm.subject}
            onChange={(event) => setTeacherForm((prev) => ({ ...prev, subject: event.target.value }))}
            required
          />
          <FormInput
            label="Employee ID"
            name="employeeId"
            value={teacherForm.employeeId}
            onChange={(event) => setTeacherForm((prev) => ({ ...prev, employeeId: event.target.value }))}
          />
          <FormInput
            label="Assigned Classes (comma separated)"
            name="assignedClasses"
            value={teacherForm.assignedClasses}
            onChange={(event) => setTeacherForm((prev) => ({ ...prev, assignedClasses: event.target.value }))}
          />
          <FormInput
            label="Phone"
            name="phone"
            value={teacherForm.phone}
            onChange={(event) => setTeacherForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={savingTeacher}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:bg-brand-300"
            >
              {savingTeacher ? "Saving..." : "Add Teacher"}
            </button>
          </div>
        </form>

        {teachers.length === 0 ? (
          <EmptyState title="No teachers yet" subtitle="Create teacher profiles to assign classes and subjects." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Teacher User</th>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Employee ID</th>
                  <th className="px-3 py-2">Assigned Classes</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher._id} className="border-b border-slate-100">
                    <td className="px-3 py-2">{teacher.user?.name || "Unlinked"}</td>
                    <td className="px-3 py-2">{teacher.subject}</td>
                    <td className="px-3 py-2">{teacher.employeeId || "-"}</td>
                    <td className="px-3 py-2">{teacher.assignedClasses?.join(", ") || "-"}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openTeacherEditModal(teacher)}
                          className="rounded-lg border border-brand-200 px-3 py-1 text-xs font-semibold text-brand-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRecord("teacher", teacher._id)}
                          className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section id="notices" className="card-surface space-y-4 p-5">
        <h2 className="font-display text-2xl font-semibold text-slate-900">Notice Board</h2>
        <form onSubmit={handleNoticeSubmit} className="grid gap-3 md:grid-cols-2">
          <FormInput
            label="Title"
            name="title"
            value={noticeForm.title}
            onChange={(event) => setNoticeForm((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
          <FormInput
            label="Audience (all/admin/teacher/student/custom)"
            name="audience"
            value={noticeForm.audience}
            onChange={(event) => setNoticeForm((prev) => ({ ...prev, audience: event.target.value }))}
            required
          />
          <FormInput
            label="Target Roles (comma separated)"
            name="targetRoles"
            value={noticeForm.targetRoles}
            onChange={(event) => setNoticeForm((prev) => ({ ...prev, targetRoles: event.target.value }))}
          />
          <FormInput
            label="Expires At (YYYY-MM-DD)"
            name="expiresAt"
            value={noticeForm.expiresAt}
            onChange={(event) => setNoticeForm((prev) => ({ ...prev, expiresAt: event.target.value }))}
          />
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Message</span>
            <textarea
              rows="4"
              value={noticeForm.message}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, message: event.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500"
              required
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={savingNotice}
              className="rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:bg-accent-300"
            >
              {savingNotice ? "Publishing..." : "Publish Notice"}
            </button>
          </div>
        </form>

        {notices.length === 0 ? (
          <EmptyState title="No notices yet" subtitle="Publish your first school-wide update." />
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => (
              <article key={notice._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{notice.title}</h3>
                    <p className="text-xs uppercase tracking-wide text-brand-700">Audience: {notice.audience}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteRecord("notice", notice._id)}
                    className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-2 text-sm text-slate-600">{notice.message}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <Modal title="Edit Student" open={Boolean(editingStudent)} onClose={() => setEditingStudent(null)}>
        <form onSubmit={saveStudentEdit} className="grid gap-3 sm:grid-cols-2">
          <FormInput
            label="Class"
            value={editStudentForm.className}
            onChange={(event) => setEditStudentForm((prev) => ({ ...prev, className: event.target.value }))}
          />
          <FormInput
            label="Roll Number"
            value={editStudentForm.rollNumber}
            onChange={(event) => setEditStudentForm((prev) => ({ ...prev, rollNumber: event.target.value }))}
          />
          <FormInput
            label="Attendance %"
            value={editStudentForm.attendanceRate}
            onChange={(event) => setEditStudentForm((prev) => ({ ...prev, attendanceRate: event.target.value }))}
          />
          <FormInput
            label="Overall Marks %"
            value={editStudentForm.overallMarks}
            onChange={(event) => setEditStudentForm((prev) => ({ ...prev, overallMarks: event.target.value }))}
          />
          <FormInput
            label="Guardian Name"
            value={editStudentForm.guardianName}
            onChange={(event) => setEditStudentForm((prev) => ({ ...prev, guardianName: event.target.value }))}
          />
          <FormInput
            label="Guardian Phone"
            value={editStudentForm.guardianPhone}
            onChange={(event) => setEditStudentForm((prev) => ({ ...prev, guardianPhone: event.target.value }))}
          />
          <button
            type="submit"
            className="sm:col-span-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Save Changes
          </button>
        </form>
      </Modal>

      <Modal title="Edit Teacher" open={Boolean(editingTeacher)} onClose={() => setEditingTeacher(null)}>
        <form onSubmit={saveTeacherEdit} className="grid gap-3 sm:grid-cols-2">
          <FormInput
            label="Subject"
            value={editTeacherForm.subject}
            onChange={(event) => setEditTeacherForm((prev) => ({ ...prev, subject: event.target.value }))}
          />
          <FormInput
            label="Employee ID"
            value={editTeacherForm.employeeId}
            onChange={(event) => setEditTeacherForm((prev) => ({ ...prev, employeeId: event.target.value }))}
          />
          <FormInput
            label="Assigned Classes"
            value={editTeacherForm.assignedClasses}
            onChange={(event) => setEditTeacherForm((prev) => ({ ...prev, assignedClasses: event.target.value }))}
          />
          <FormInput
            label="Phone"
            value={editTeacherForm.phone}
            onChange={(event) => setEditTeacherForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
          <button
            type="submit"
            className="sm:col-span-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
