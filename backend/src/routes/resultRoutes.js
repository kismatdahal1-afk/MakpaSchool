import express from "express";
import {
  createResult,
  deleteResult,
  getResultById,
  getResults,
  updateResult,
} from "../controllers/resultController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(protect);

router
  .route("/")
  .get(authorize("admin", "teacher", "student"), getResults)
  .post(authorize("admin", "teacher"), createResult);

router
  .route("/:id")
  .get(authorize("admin", "teacher", "student"), getResultById)
  .put(authorize("admin", "teacher"), updateResult)
  .delete(authorize("admin"), deleteResult);

export default router;
