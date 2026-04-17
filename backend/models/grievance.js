const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    room: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    adminReply: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grievance", grievanceSchema);
