require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");
const Notice = require("./models/notice");
const Grievance = require("./models/grievance");
const RoomRequest = require("./models/roomRequest");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

const STUDENT_FIELDS = ["fullName", "email", "phone", "department", "year", "room"];

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  const { username, password, role } = req.body;

  const user = await User.findOne({ username, role });

  if (!user) {
    return res.send({ message: "User not found" });
  }

  if (!user.password) {
    return res.send({ message: "Please set your password first" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (match) {
    res.send({
      message: "Login successful",
      role: user.role,
      username: user.username
    });
  } else {
    res.send({ message: "Wrong password" });
  }
});

/* ================= REGISTER ================= */
app.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      return res.send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role
    });

    await user.save();

    res.send({ message: "User created" });

  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error creating user" });
  }
});

/* ================= CREATE STUDENT (ADMIN) ================= */
app.post("/create-student", async (req, res) => {
  try {
    const data = req.body;

    // Single student
    if (!Array.isArray(data)) {
      const existing = await User.findOne({ username: data.username });
      if (existing) {
        return res.send({ message: "User already exists" });
      }

      const studentDetails = STUDENT_FIELDS.reduce((acc, field) => {
        acc[field] = data[field] || "";
        return acc;
      }, {});

      const user = new User({
        username: data.username,
        password: "",
        role: "student",
        ...studentDetails
      });

      await user.save();
      return res.send({ message: "Student created" });
    }

    // Multiple students
    const users = data.map((u) => {
      const studentDetails = STUDENT_FIELDS.reduce((acc, field) => {
        acc[field] = u[field] || "";
        return acc;
      }, {});

      return {
        username: u.username,
        password: "",
        role: "student",
        ...studentDetails
      };
    });

    await User.insertMany(users);

    res.send({ message: "Multiple students created" });

  } catch (err) {
    console.log("FULL ERROR 👉", err);
    res.status(500).send({ message: err.message });
  }
});

/* ================= GET STUDENTS ================= */
app.get("/students", async (_req, res) => {
  try {
    const students = await User.find({ role: "student" }).sort({ username: 1 });
    res.send(students);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error fetching students" });
  }
});

/* ================= UPDATE STUDENT ================= */
app.put("/students/:id", async (req, res) => {
  try {
    const updates = {
      username: req.body.username || "",
    };

    STUDENT_FIELDS.forEach((field) => {
      updates[field] = req.body[field] || "";
    });

    const existing = await User.findOne({
      _id: { $ne: req.params.id },
      username: updates.username
    });

    if (existing) {
      return res.status(400).send({ message: "Username already exists" });
    }

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: "student" },
      updates,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }

    res.send({ message: "Student updated", student });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error updating student" });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const student = await User.findOneAndDelete({
      _id: req.params.id,
      role: "student"
    });

    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }

    res.send({ message: "Student deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error deleting student" });
  }
});

/* ================= NOTICES ================= */
app.get("/notices", async (_req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.send(notices);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error fetching notices" });
  }
});

app.post("/notices", async (req, res) => {
  try {
    const text = (req.body.text || "").trim();

    if (!text) {
      return res.status(400).send({ message: "Notice text is required" });
    }

    const notice = await Notice.create({ text });
    res.status(201).send({ message: "Notice created", notice });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error creating notice" });
  }
});

app.delete("/notices/:id", async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).send({ message: "Notice not found" });
    }

    res.send({ message: "Notice deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error deleting notice" });
  }
});

/* ================= GRIEVANCES ================= */
app.get("/grievances", async (req, res) => {
  try {
    const query = req.query.username ? { username: req.query.username } : {};
    const grievances = await Grievance.find(query).sort({ createdAt: -1 });
    res.send(grievances);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error fetching grievances" });
  }
});

app.post("/grievances", async (req, res) => {
  try {
    const grievance = await Grievance.create({
      username: req.body.username,
      name: req.body.name,
      room: req.body.room,
      studentId: req.body.studentId,
      category: req.body.category,
      description: req.body.description,
    });
    res.status(201).send({ message: "Grievance submitted", grievance });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error submitting grievance" });
  }
});

app.put("/grievances/:id", async (req, res) => {
  try {
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        adminReply: req.body.adminReply || "",
      },
      { new: true, runValidators: true }
    );

    if (!grievance) {
      return res.status(404).send({ message: "Grievance not found" });
    }

    res.send({ message: "Grievance updated", grievance });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error updating grievance" });
  }
});

app.delete("/grievances/:id", async (req, res) => {
  try {
    const grievance = await Grievance.findByIdAndDelete(req.params.id);

    if (!grievance) {
      return res.status(404).send({ message: "Grievance not found" });
    }

    res.send({ message: "Grievance deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error deleting grievance" });
  }
});

/* ================= ROOM REQUESTS ================= */
app.get("/room-requests", async (req, res) => {
  try {
    const query = req.query.username ? { username: req.query.username } : {};
    const requests = await RoomRequest.find(query).sort({ createdAt: -1 });
    res.send(requests);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error fetching room requests" });
  }
});

app.post("/room-requests", async (req, res) => {
  try {
    const request = await RoomRequest.create({
      username: req.body.username,
      name: req.body.name,
      collegeId: req.body.collegeId,
      dept: req.body.dept,
      year: req.body.year,
      block: req.body.block,
      room: req.body.room,
      floor: req.body.floor,
      type: req.body.type,
      phone: req.body.phone,
      parent: req.body.parent,
    });
    res.status(201).send({ message: "Room request submitted", request });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error submitting room request" });
  }
});

app.put("/room-requests/:id", async (req, res) => {
  try {
    const request = await RoomRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        allottedRoom: req.body.allottedRoom || "",
        adminReply: req.body.adminReply || "",
      },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).send({ message: "Room request not found" });
    }

    res.send({ message: "Room request updated", request });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error updating room request" });
  }
});

/* ================= SET PASSWORD (FIRST TIME) ================= */
app.post("/set-password", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.send({ message: "User not found" });
    }

    if (user.password) {
      return res.send({ message: "Password already set" });
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    await user.save();

    res.send({ message: "Password set successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error" });
  }
});

/* ================= FORGOT PASSWORD ================= */
app.post("/forgot-password", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.send({ message: "User not found" });
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    await user.save();

    res.send({ message: "Password reset successful" });

  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error" });
  }
});

/* ================= DATABASE CONNECTION ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected 🚀"))
  .catch(err => console.log("Connection Error ❌:", err));

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

/* ================= SERVER ================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
