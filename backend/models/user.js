const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: {
    type: String,
    default: ""
  },
  role: String,
  fullName: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  department: {
    type: String,
    default: ""
  },
  year: {
    type: String,
    default: ""
  },
  room: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("User", userSchema);
