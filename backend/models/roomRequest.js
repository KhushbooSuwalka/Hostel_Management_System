const mongoose = require("mongoose");

const roomRequestSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    collegeId: { type: String, required: true, trim: true },
    dept: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    block: { type: String, required: true, trim: true },
    room: { type: String, default: "", trim: true },
    floor: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    parent: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Allotted"],
      default: "Pending",
    },
    allottedRoom: { type: String, default: "", trim: true },
    adminReply: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomRequest", roomRequestSchema);
