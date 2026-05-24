import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      enum: ["all", "admin", "teacher", "student", "custom"],
      default: "all",
    },
    targetRoles: [
      {
        type: String,
        enum: ["admin", "teacher", "student"],
      },
    ],
    expiresAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);
export default Notice;
