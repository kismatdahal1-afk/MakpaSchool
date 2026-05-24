import Notice from "../models/Notice.js";
import asyncHandler from "../utils/asyncHandler.js";

const buildActiveNoticeFilter = () => ({
  $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: new Date() } }],
});

export const createNotice = asyncHandler(async (req, res) => {
  const { title, message, audience = "all", targetRoles = [], expiresAt } = req.body;

  if (!title || !message) {
    res.status(400);
    throw new Error("title and message are required.");
  }

  const notice = await Notice.create({
    title,
    message,
    audience,
    targetRoles,
    expiresAt,
    createdBy: req.user._id,
  });

  res.status(201).json({ message: "Notice created successfully.", notice });
});

export const getNotices = asyncHandler(async (req, res) => {
  let filter = buildActiveNoticeFilter();

  if (req.user.role !== "admin") {
    const audienceFilter = {
      $or: [
        { audience: "all" },
        { audience: req.user.role },
        { audience: "custom", targetRoles: req.user.role },
      ],
    };

    filter = { $and: [filter, audienceFilter] };
  }

  const notices = await Notice.find(filter).populate("createdBy", "name role").sort({ createdAt: -1 });
  res.status(200).json({ count: notices.length, notices });
});

export const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id).populate("createdBy", "name role");

  if (!notice) {
    res.status(404);
    throw new Error("Notice not found.");
  }

  res.status(200).json({ notice });
});

export const updateNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    res.status(404);
    throw new Error("Notice not found.");
  }

  notice.title = req.body.title ?? notice.title;
  notice.message = req.body.message ?? notice.message;
  notice.audience = req.body.audience ?? notice.audience;
  notice.targetRoles = req.body.targetRoles ?? notice.targetRoles;
  notice.expiresAt = req.body.expiresAt ?? notice.expiresAt;

  const updated = await notice.save();
  res.status(200).json({ message: "Notice updated successfully.", notice: updated });
});

export const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    res.status(404);
    throw new Error("Notice not found.");
  }

  await notice.deleteOne();
  res.status(200).json({ message: "Notice deleted successfully." });
});
