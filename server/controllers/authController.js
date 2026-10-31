const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const payload = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, department: u.department, token: sign(u._id) });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ name, email, password, role: ["HR", "Manager", "Employee"].includes(role) ? role : "Employee", department: "General" });
    await Employee.create({ user: user._id, name, email: user.email, department: "General", position: user.role, salary: 0, joinDate: new Date() });
    res.status(201).json(payload(user));
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user || !(await user.matchPassword(password || ""))) return res.status(401).json({ message: "Invalid email or password" });
    res.json(payload(user));
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.me = (req, res) => res.json(req.user);
