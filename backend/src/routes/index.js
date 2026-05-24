import express from "express";
import attendanceRoutes from "./attendanceRoutes.js";
import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import noticeRoutes from "./noticeRoutes.js";
import resultRoutes from "./resultRoutes.js";
import studentRoutes from "./studentRoutes.js";
import teacherRoutes from "./teacherRoutes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "MakpaSchool API" });
});

router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/teachers", teacherRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/results", resultRoutes);
router.use("/notices", noticeRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
