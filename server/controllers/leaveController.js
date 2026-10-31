const Leave = require("../models/Leave");

exports.apply = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    if (new Date(endDate) < new Date(startDate)) return res.status(400).json({ message: "End date cannot be before start date" });
    const leave = await Leave.create({ user: req.user._id, startDate, endDate, reason });
    res.status(201).json(leave);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.myLeaves = async (req, res) => {
  res.json(await Leave.find({ user: req.user._id }).sort({ createdAt: -1 }));
};

// HR sees all requests. Manager sees requests from Employees (not other managers/HR).
exports.all = async (req, res) => {
  let leaves = await Leave.find().populate("user", "name email role department").sort({ createdAt: -1 });
  if (req.user.role === "Manager") leaves = leaves.filter((l) => l.user && l.user.role === "Employee");
  res.json(leaves);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Rejected", "Pending"].includes(status)) return res.status(400).json({ message: "Invalid status" });
  const leave = await Leave.findById(req.params.id).populate("user", "role");
  if (!leave) return res.status(404).json({ message: "Leave not found" });
  if (String(leave.user._id) === String(req.user._id)) return res.status(400).json({ message: "You cannot review your own leave" });
  if (req.user.role === "Manager" && leave.user.role !== "Employee") return res.status(403).json({ message: "Managers can only review employee leaves" });
  leave.status = status;
  leave.approverRole = req.user.role;
  await leave.save();
  res.json(leave);
};
