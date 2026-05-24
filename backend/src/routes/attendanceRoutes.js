import express from "express";
import {
  createOrUpdateAttendance,
  deleteAttendance,
  getAttendanceById,
  getAttendanceRecords,
  updateAttendance,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(protect);

router
  .route("/")
  .get(authorize("admin", "teacher", "student"), getAttendanceRecords)
  .post(authorize("admin", "teacher"), createOrUpdateAttendance);

router
  .route("/:id")
  .get(authorize("admin", "teacher", "student"), getAttendanceById)
  .put(authorize("admin", "teacher"), updateAttendance)
  .delete(authorize("admin"), deleteAttendance);

export default router;
