import express from "express";
import {
  createNotice,
  deleteNotice,
  getNoticeById,
  getNotices,
  updateNotice,
} from "../controllers/noticeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(protect);

router.route("/").get(getNotices).post(authorize("admin", "teacher"), createNotice);
router
  .route("/:id")
  .get(getNoticeById)
  .put(authorize("admin", "teacher"), updateNotice)
  .delete(authorize("admin"), deleteNotice);

export default router;
