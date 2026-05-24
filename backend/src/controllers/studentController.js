import Student from "../models/Student.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createStudent = asyncHandler(async (req, res) => {
  const {
    userId,
    admissionNo,
    className,
    rollNumber,
    guardianName,
    guardianPhone,
    attendanceRate,
    overallMarks,
  } = req.body;

  if (!className || !rollNumber) {
    res.status(400);
    throw new Error("className and rollNumber are required.");
  }

  if (userId) {
    const linkedUser = await User.findById(userId);
    if (!linkedUser) {
      res.status(404);
      throw new Error("Linked user was not found.");
    }

    if (linkedUser.role !== "student") {
      res.status(400);
      throw new Error("Linked user must have role 'student'.");
    }
  }

  try {
    const student = await Student.create({
      user: userId || undefined,
      admissionNo,
      className,
      rollNumber,
      guardianName,
      guardianPhone,
      attendanceRate,
      overallMarks,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Student created successfully.", student });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      throw new Error("Duplicate value. Check admissionNo or class/roll.");
    }
    throw error;
  }
});

export const getStudents = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.className) {
    filter.className = req.query.className;
  }

  if (req.user.role === "student") {
    filter.user = req.user._id;
  }

  const students = await Student.find(filter)
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({ count: students.length, students });
});

export const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id).populate("user", "name email role");

  if (!student) {
    res.status(404);
    throw new Error("Student not found.");
  }

  if (req.user.role === "student" && String(student.user?._id) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only view your own profile.");
  }

  res.status(200).json({ student });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found.");
  }

  if (req.body.userId) {
    const linkedUser = await User.findById(req.body.userId);
    if (!linkedUser || linkedUser.role !== "student") {
      res.status(400);
      throw new Error("Linked user must exist and have role 'student'.");
    }
    student.user = linkedUser._id;
  }

  student.admissionNo = req.body.admissionNo ?? student.admissionNo;
  student.className = req.body.className ?? student.className;
  student.rollNumber = req.body.rollNumber ?? student.rollNumber;
  student.guardianName = req.body.guardianName ?? student.guardianName;
  student.guardianPhone = req.body.guardianPhone ?? student.guardianPhone;
  student.attendanceRate = req.body.attendanceRate ?? student.attendanceRate;
  student.overallMarks = req.body.overallMarks ?? student.overallMarks;

  try {
    const updated = await student.save();
    res.status(200).json({ message: "Student updated successfully.", student: updated });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      throw new Error("Duplicate value. Check admissionNo or class/roll.");
    }
    throw error;
  }
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found.");
  }

  await student.deleteOne();
  res.status(200).json({ message: "Student deleted successfully." });
});
