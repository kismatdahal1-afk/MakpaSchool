import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    employeeId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    assignedClasses: [
      {
        type: String,
        trim: true,
      },
    ],
    phone: {
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

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
