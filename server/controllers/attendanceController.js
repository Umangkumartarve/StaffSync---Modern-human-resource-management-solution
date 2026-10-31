const Attendance = require("../models/Attendance");
const User = require("../models/User");

const today = () => new Date().toISOString().slice(0, 10);

exports.mark = async (req, res) => {
  try {
    const now = new Date();
    const status = now.getHours() >= 10 ? "Late" : "Present";
    const rec = await Attendance.create({
      user: req.user._id, date: today(), status,
      checkIn: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    });
    res.status(201).json(rec);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: "Attendance already marked for today" });
    res.status(400).json({ message: e.message });
  }
};

exports.mine = async (req, res) => {
  res.json(await Attendance.find({ user: req.user._id }).sort({ date: -1 }));
};

exports.all = async (req, res) => {
  const filter = req.query.date ? { date: req.query.date } : {};
  res.json(await Attendance.find(filter).populate("user", "name email department role").sort({ date: -1 }).limit(500));
};

// Per-employee summary + who is absent today
exports.summary = async (req, res) => {
  const users = await User.find().select("name email department role");
  const records = await Attendance.find();
  const t = today();
  const rows = users.map((u) => {
    const mine = records.filter((r) => String(r.user) === String(u._id));
    return {
      _id: u._id, name: u.name, email: u.email, department: u.department, role: u.role,
      present: mine.filter((r) => r.status === "Present").length,
      late: mine.filter((r) => r.status === "Late").length,
      total: mine.length,
      today: mine.find((r) => r.date === t)?.status || "Absent",
    };
  });
  res.json(rows);
};
