import api from "./api.js";

export const schoolService = {
  getDashboardStats() {
    return api.get("/dashboard/stats");
  },

  getStudents(params) {
    return api.get("/students", { params });
  },
  createStudent(payload) {
    return api.post("/students", payload);
  },
  updateStudent(id, payload) {
    return api.put(`/students/${id}`, payload);
  },
  deleteStudent(id) {
    return api.delete(`/students/${id}`);
  },

  getTeachers(params) {
    return api.get("/teachers", { params });
  },
  createTeacher(payload) {
    return api.post("/teachers", payload);
  },
  updateTeacher(id, payload) {
    return api.put(`/teachers/${id}`, payload);
  },
  deleteTeacher(id) {
    return api.delete(`/teachers/${id}`);
  },

  getAttendance(params) {
    return api.get("/attendance", { params });
  },
  saveAttendance(payload) {
    return api.post("/attendance", payload);
  },
  updateAttendance(id, payload) {
    return api.put(`/attendance/${id}`, payload);
  },
  deleteAttendance(id) {
    return api.delete(`/attendance/${id}`);
  },

  getResults(params) {
    return api.get("/results", { params });
  },
  createResult(payload) {
    return api.post("/results", payload);
  },
  updateResult(id, payload) {
    return api.put(`/results/${id}`, payload);
  },
  deleteResult(id) {
    return api.delete(`/results/${id}`);
  },

  getNotices() {
    return api.get("/notices");
  },
  createNotice(payload) {
    return api.post("/notices", payload);
  },
  updateNotice(id, payload) {
    return api.put(`/notices/${id}`, payload);
  },
  deleteNotice(id) {
    return api.delete(`/notices/${id}`);
  },
};
