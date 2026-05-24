import express from "express";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(authorize("admin", "teacher", "student"), getStudents)
  .post(authorize("admin", "teacher"), createStudent);

router
  .route("/:id")
  .get(authorize("admin", "teacher", "student"), getStudentById)
  .put(authorize("admin", "teacher"), updateStudent)
  .delete(authorize("admin"), deleteStudent);

export default router;
