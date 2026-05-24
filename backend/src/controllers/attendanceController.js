import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import asyncHandler from "../utils/asyncHandler.js";

const normalizeDate = (value) => {
  const date = new Date(value || Date.now());
  date.setHours(0, 0, 0, 0);
  return date;
};

export const createOrUpdateAttendance = asyncHandler(async (req, res) => {
  const { studentId, className, date, status = "present", remarks } = req.body;

  if (!studentId || !className) {
    res.status(400);
    throw new Error("studentId and className are required.");
  }

  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found.");
  }

  const normalizedDate = normalizeDate(date);

  const attendance = await Attendance.findOneAndUpdate(
    { student: studentId, date: normalizedDate },
    {
      student: studentId,
      className,
      date: normalizedDate,
      status,
      remarks,
      markedBy: req.user._id,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  res.status(200).json({
    message: "Attendance saved successfully.",
    attendance,
  });
});

export const getAttendanceRecords = asyncHandler(async (req, res) => {
  const { studentId, className, startDate, endDate } = req.query;
  const filter = {};

  if (studentId) {
    filter.student = studentId;
  }

  if (className) {
    filter.className = className;
  }

  if (startDate || endDate) {
    filter.date = {};

    if (startDate) {
      filter.date.$gte = normalizeDate(startDate);
    }
    if (endDate) {
      const until = normalizeDate(endDate);
      until.setHours(23, 59, 59, 999);
      filter.date.$lte = until;
    }
  }

  if (req.user.role === "student") {
    const studentProfile = await Student.findOne({ user: req.user._id });
    if (!studentProfile) {
      return res.status(200).json({ count: 0, attendanceRecords: [] });
    }
    filter.student = studentProfile._id;
  }

  const attendanceRecords = await Attendance.find(filter)
    .populate("student", "className rollNumber")
    .populate("markedBy", "name role")
    .sort({ date: -1 });

  res.status(200).json({ count: attendanceRecords.length, attendanceRecords });
});

export const getAttendanceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const attendance = await Attendance.findById(id)
    .populate("student", "className rollNumber")
    .populate("markedBy", "name role");

  if (!attendance) {
    res.status(404);
    throw new Error("Attendance record not found.");
  }

  if (req.user.role === "student") {
    const studentProfile = await Student.findOne({ user: req.user._id });
    if (!studentProfile || String(attendance.student._id) !== String(studentProfile._id)) {
      res.status(403);
      throw new Error("You can only view your own attendance.");
    }
  }

  res.status(200).json({ attendance });
});

export const updateAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const attendance = await Attendance.findById(id);

  if (!attendance) {
    res.status(404);
    throw new Error("Attendance record not found.");
  }

  attendance.status = req.body.status ?? attendance.status;
  attendance.remarks = req.body.remarks ?? attendance.remarks;
  attendance.className = req.body.className ?? attendance.className;
  attendance.markedBy = req.user._id;
  attendance.date = req.body.date ? normalizeDate(req.body.date) : attendance.date;

  const updated = await attendance.save();
  res.status(200).json({ message: "Attendance updated successfully.", attendance: updated });
});

export const deleteAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const attendance = await Attendance.findById(id);

  if (!attendance) {
    res.status(404);
    throw new Error("Attendance record not found.");
  }

  await attendance.deleteOne();
  res.status(200).json({ message: "Attendance deleted successfully." });
});
