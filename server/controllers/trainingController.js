const Training = require("../models/Training");
const User = require("../models/User");

exports.create = async (req, res) => {
  try {
    const { title, description, date, trainer, assignedTo } = req.body;
    const t = await Training.create({ title, description, date, trainer: trainer || "TBD", assignedTo: assignedTo || [], createdBy: req.user._id });
    res.status(201).json(t);
  } catch (e) { res.status(400).json({ message: e.message }); }
};

// Manager/HR: all programs. Employee: only the ones assigned to them.
exports.getAll = async (req, res) => {
  const filter = req.user.role === "Employee" ? { assignedTo: req.user._id } : {};
  res.json(await Training.find(filter).populate("assignedTo", "name email").populate("createdBy", "name").sort({ date: 1 }));
};

exports.update = async (req, res) => {
  const t = await Training.findById(req.params.id);
  if (!t) return res.status(404).json({ message: "Training not found" });
  const { title, description, date, trainer, assignedTo } = req.body;
  Object.assign(t, { title, description, date, trainer, assignedTo });
  await t.save();
  res.json(t);
};

exports.remove = async (req, res) => {
  const t = await Training.findByIdAndDelete(req.params.id);
  if (!t) return res.status(404).json({ message: "Training not found" });
  res.json({ message: "Training deleted" });
};

exports.assignable = async (req, res) => {
  res.json(await User.find({ role: "Employee" }).select("name email department"));
};
