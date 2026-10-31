const Employee = require("../models/Employee");
const User = require("../models/User");
const Leave = require("../models/Leave");
const Attendance = require("../models/Attendance");

exports.getAll = async (req, res) => {
  const list = await Employee.find().populate("user", "role").sort({ createdAt: -1 });
  res.json(list);
};

exports.create = async (req, res) => {
  try {
    const { name, email, department, position, salary, joinDate, phone, address, role, password } = req.body;
    if (await User.findOne({ email: (email || "").toLowerCase() })) return res.status(400).json({ message: "Email already exists" });
    const user = await User.create({ name, email, password: password || "password123", role: role || "Employee", department });
    const emp = await Employee.create({ user: user._id, name, email, department, position, salary, joinDate, phone, address });
    res.status(201).json(emp);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    const { name, department, position, salary, joinDate, phone, address, role } = req.body;
    Object.assign(emp, { name, department, position, salary, joinDate, phone, address });
    await emp.save();
    if (emp.user) await User.findByIdAndUpdate(emp.user, { name, department, ...(role ? { role } : {}) });
    res.json(emp);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.remove = async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) return res.status(404).json({ message: "Employee not found" });
  if (emp.user) {
    if (String(emp.user) === String(req.user._id)) return res.status(400).json({ message: "You cannot delete your own account" });
    await Promise.all([User.findByIdAndDelete(emp.user), Leave.deleteMany({ user: emp.user }), Attendance.deleteMany({ user: emp.user })]);
  }
  await emp.deleteOne();
  res.json({ message: "Employee deleted" });
};

exports.getMe = async (req, res) => {
  const emp = await Employee.findOne({ user: req.user._id });
  res.json(emp);
};

exports.updateMe = async (req, res) => {
  const { name, phone, address } = req.body;
  const emp = await Employee.findOne({ user: req.user._id });
  if (!emp) return res.status(404).json({ message: "Profile not found" });
  if (name) { emp.name = name; await User.findByIdAndUpdate(req.user._id, { name }); }
  if (phone !== undefined) emp.phone = phone;
  if (address !== undefined) emp.address = address;
  await emp.save();
  res.json(emp);
};
