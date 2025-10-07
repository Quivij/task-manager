const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date }, // ngày deadline
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
