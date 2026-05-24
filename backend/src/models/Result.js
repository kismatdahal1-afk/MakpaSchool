import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    examName: {
      type: String,
      required: true,
      trim: true,
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },
    maxMarks: {
      type: Number,
      default: 100,
      min: 1,
    },
    grade: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Result = mongoose.model("Result", resultSchema);
export default Result;
