import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    admissionNo: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
    },
    rollNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    attendanceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    overallMarks: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    guardianName: {
      type: String,
      trim: true,
    },
    guardianPhone: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

studentSchema.index({ className: 1, rollNumber: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;
