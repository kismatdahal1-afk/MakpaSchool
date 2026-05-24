import Result from "../models/Result.js";
import Student from "../models/Student.js";
import asyncHandler from "../utils/asyncHandler.js";

const calculateGrade = (marks, maxMarks) => {
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

export const createResult = asyncHandler(async (req, res) => {
  const {
    studentId,
    subject,
    examName,
    marksObtained,
    maxMarks = 100,
    remarks,
  } = req.body;

  if (!studentId || !subject || !examName || marksObtained === undefined) {
    res.status(400);
    throw new Error("studentId, subject, examName, and marksObtained are required.");
  }

  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found.");
  }

  const safeMaxMarks = Number(maxMarks) || 100;
  const safeMarks = Number(marksObtained);

  if (safeMarks < 0 || safeMarks > safeMaxMarks) {
    res.status(400);
    throw new Error("marksObtained must be between 0 and maxMarks.");
  }

  const grade = calculateGrade(safeMarks, safeMaxMarks);

  const result = await Result.create({
    student: studentId,
    subject,
    examName,
    marksObtained: safeMarks,
    maxMarks: safeMaxMarks,
    grade,
    remarks,
    enteredBy: req.user._id,
  });

  res.status(201).json({ message: "Result created successfully.", result });
});

export const getResults = asyncHandler(async (req, res) => {
  const { studentId, subject, examName } = req.query;
  const filter = {};

  if (studentId) {
    filter.student = studentId;
  }
  if (subject) {
    filter.subject = subject;
  }
  if (examName) {
    filter.examName = examName;
  }

  if (req.user.role === "student") {
    const studentProfile = await Student.findOne({ user: req.user._id });
    if (!studentProfile) {
      return res.status(200).json({ count: 0, results: [] });
    }
    filter.student = studentProfile._id;
  }

  const results = await Result.find(filter)
    .populate("student", "className rollNumber")
    .populate("enteredBy", "name role")
    .sort({ createdAt: -1 });

  res.status(200).json({ count: results.length, results });
});

export const getResultById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await Result.findById(id)
    .populate("student", "className rollNumber user")
    .populate("enteredBy", "name role");

  if (!result) {
    res.status(404);
    throw new Error("Result not found.");
  }

  if (req.user.role === "student") {
    const studentProfile = await Student.findOne({ user: req.user._id });
    if (!studentProfile || String(result.student._id) !== String(studentProfile._id)) {
      res.status(403);
      throw new Error("You can only view your own results.");
    }
  }

  res.status(200).json({ result });
});

export const updateResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await Result.findById(id);

  if (!result) {
    res.status(404);
    throw new Error("Result not found.");
  }

  result.subject = req.body.subject ?? result.subject;
  result.examName = req.body.examName ?? result.examName;
  result.remarks = req.body.remarks ?? result.remarks;
  result.enteredBy = req.user._id;

  if (req.body.studentId) {
    const student = await Student.findById(req.body.studentId);
    if (!student) {
      res.status(404);
      throw new Error("Student not found.");
    }
    result.student = student._id;
  }

  const nextMax = req.body.maxMarks ?? result.maxMarks;
  const nextMarks = req.body.marksObtained ?? result.marksObtained;

  if (Number(nextMarks) < 0 || Number(nextMarks) > Number(nextMax)) {
    res.status(400);
    throw new Error("marksObtained must be between 0 and maxMarks.");
  }

  result.maxMarks = Number(nextMax);
  result.marksObtained = Number(nextMarks);
  result.grade = calculateGrade(result.marksObtained, result.maxMarks);

  const updated = await result.save();
  res.status(200).json({ message: "Result updated successfully.", result: updated });
});

export const deleteResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await Result.findById(id);

  if (!result) {
    res.status(404);
    throw new Error("Result not found.");
  }

  await result.deleteOne();
  res.status(200).json({ message: "Result deleted successfully." });
});
