import express from "express";
import {
  createTeacher,
  deleteTeacher,
  getTeacherById,
  getTeachers,
  updateTeacher,
} from "../controllers/teacherController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(protect);

router.route("/").get(authorize("admin", "teacher"), getTeachers).post(authorize("admin"), createTeacher);

router
  .route("/:id")
  .get(authorize("admin", "teacher"), getTeacherById)
  .put(authorize("admin"), updateTeacher)
  .delete(authorize("admin"), deleteTeacher);

export default router;
