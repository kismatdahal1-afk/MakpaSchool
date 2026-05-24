import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createTeacher = asyncHandler(async (req, res) => {
  const { userId, employeeId, subject, assignedClasses = [], phone } = req.body;

  if (!subject) {
    res.status(400);
    throw new Error("subject is required.");
  }

  if (userId) {
    const linkedUser = await User.findById(userId);
    if (!linkedUser) {
      res.status(404);
      throw new Error("Linked user was not found.");
    }
    if (linkedUser.role !== "teacher") {
      res.status(400);
      throw new Error("Linked user must have role 'teacher'.");
    }
  }

  try {
    const teacher = await Teacher.create({
      user: userId || undefined,
      employeeId,
      subject,
      assignedClasses,
      phone,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Teacher created successfully.", teacher });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      throw new Error("Employee ID already exists.");
    }
    throw error;
  }
});

export const getTeachers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "teacher") {
    filter.user = req.user._id;
  }

  const teachers = await Teacher.find(filter)
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({ count: teachers.length, teachers });
});

export const getTeacherById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findById(id).populate("user", "name email role");

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found.");
  }

  if (req.user.role === "teacher" && String(teacher.user?._id) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only view your own profile.");
  }

  res.status(200).json({ teacher });
});

export const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findById(id);

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found.");
  }

  if (req.body.userId) {
    const linkedUser = await User.findById(req.body.userId);
    if (!linkedUser || linkedUser.role !== "teacher") {
      res.status(400);
      throw new Error("Linked user must exist and have role 'teacher'.");
    }
    teacher.user = linkedUser._id;
  }

  teacher.employeeId = req.body.employeeId ?? teacher.employeeId;
  teacher.subject = req.body.subject ?? teacher.subject;
  teacher.assignedClasses = req.body.assignedClasses ?? teacher.assignedClasses;
  teacher.phone = req.body.phone ?? teacher.phone;

  try {
    const updated = await teacher.save();
    res.status(200).json({ message: "Teacher updated successfully.", teacher: updated });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      throw new Error("Employee ID already exists.");
    }
    throw error;
  }
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findById(id);

  if (!teacher) {
    res.status(404);
    throw new Error("Teacher not found.");
  }

  await teacher.deleteOne();
  res.status(200).json({ message: "Teacher deleted successfully." });
});
