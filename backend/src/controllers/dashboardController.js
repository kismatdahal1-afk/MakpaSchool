import Attendance from "../models/Attendance.js";
import Notice from "../models/Notice.js";
import Result from "../models/Result.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const getVisibleNoticeFilter = (role) => {
  const activeFilter = {
    $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  };

  if (role === "admin") {
    return activeFilter;
  }

  return {
    $and: [
      activeFilter,
      {
        $or: [{ audience: "all" }, { audience: role }, { audience: "custom", targetRoles: role }],
      },
    ],
  };
};

export const getDashboardStats = asyncHandler(async (req, res) => {
  const { role, _id: userId } = req.user;
  const { start, end } = getTodayRange();

  if (role === "admin") {
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalNotices,
      todayAttendanceRecords,
      presentToday,
      recentNotices,
    ] = await Promise.all([
      User.countDocuments(),
      Student.countDocuments(),
      Teacher.countDocuments(),
      Notice.countDocuments(),
      Attendance.countDocuments({ date: { $gte: start, $lte: end } }),
      Attendance.countDocuments({ date: { $gte: start, $lte: end }, status: "present" }),
      Notice.find(getVisibleNoticeFilter("admin"))
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title audience createdAt"),
    ]);

    return res.status(200).json({
      role,
      stats: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalNotices,
        todayAttendanceRecords,
        presentToday,
      },
      recentNotices,
    });
  }

  if (role === "teacher") {
    const teacherProfile = await Teacher.findOne({ user: userId });
    const classes = teacherProfile?.assignedClasses || [];

    const [studentsInAssignedClasses, todayAttendanceRecords, resultsEntered, recentNotices] =
      await Promise.all([
        classes.length ? Student.countDocuments({ className: { $in: classes } }) : 0,
        classes.length
          ? Attendance.countDocuments({
              className: { $in: classes },
              date: { $gte: start, $lte: end },
            })
          : 0,
        Result.countDocuments({ enteredBy: userId }),
        Notice.find(getVisibleNoticeFilter("teacher"))
          .sort({ createdAt: -1 })
          .limit(5)
          .select("title audience createdAt"),
      ]);

    return res.status(200).json({
      role,
      stats: {
        assignedClasses: classes.length,
        studentsInAssignedClasses,
        todayAttendanceRecords,
        resultsEntered,
      },
      profile: teacherProfile,
      recentNotices,
    });
  }

  const studentProfile = await Student.findOne({ user: userId });

  if (!studentProfile) {
    return res.status(200).json({
      role,
      stats: {
        totalAttendanceRecords: 0,
        attendanceRate: 0,
        resultsPublished: 0,
      },
      recentNotices: [],
    });
  }

  const [totalAttendanceRecords, presentRecords, resultsPublished, avgMarksResult, recentNotices] =
    await Promise.all([
      Attendance.countDocuments({ student: studentProfile._id }),
      Attendance.countDocuments({ student: studentProfile._id, status: "present" }),
      Result.countDocuments({ student: studentProfile._id }),
      Result.aggregate([
        { $match: { student: studentProfile._id } },
        { $group: { _id: null, averageScore: { $avg: { $divide: ["$marksObtained", "$maxMarks"] } } } },
      ]),
      Notice.find(getVisibleNoticeFilter("student"))
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title audience createdAt"),
    ]);

  const attendanceRate =
    totalAttendanceRecords > 0 ? Number(((presentRecords / totalAttendanceRecords) * 100).toFixed(2)) : 0;

  const averageScore =
    avgMarksResult.length > 0 ? Number((avgMarksResult[0].averageScore * 100).toFixed(2)) : 0;

  return res.status(200).json({
    role,
    stats: {
      totalAttendanceRecords,
      attendanceRate,
      resultsPublished,
      averageScore,
    },
    profile: studentProfile,
    recentNotices,
  });
});
