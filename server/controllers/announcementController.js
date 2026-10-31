const Announcement = require("../models/Announcement");

exports.getAll = async (req, res) => {
  let filter = {};
  if (req.user.role === "Employee") filter = { targetAudience: { $in: ["All", "Employees"] } };
  if (req.user.role === "Manager") filter = { targetAudience: { $in: ["All", "Managers"] } };
  res.json(await Announcement.find(filter).populate("createdBy", "name role").sort({ createdAt: -1 }));
};

exports.create = async (req, res) => {
  try {
    const { title, message, targetAudience } = req.body;
    const a = await Announcement.create({ title, message, targetAudience, createdBy: req.user._id });
    res.status(201).json(await a.populate("createdBy", "name role"));
  } catch (e) { res.status(400).json({ message: e.message }); }
};

exports.update = async (req, res) => {
  const a = await Announcement.findById(req.params.id);
  if (!a) return res.status(404).json({ message: "Announcement not found" });
  if (req.user.role !== "HR" && String(a.createdBy) !== String(req.user._id)) return res.status(403).json({ message: "Not allowed" });
  const { title, message, targetAudience } = req.body;
  Object.assign(a, { title, message, targetAudience });
  await a.save();
  res.json(a);
};

exports.remove = async (req, res) => {
  const a = await Announcement.findById(req.params.id);
  if (!a) return res.status(404).json({ message: "Announcement not found" });
  if (req.user.role !== "HR" && String(a.createdBy) !== String(req.user._id)) return res.status(403).json({ message: "Not allowed" });
  await a.deleteOne();
  res.json({ message: "Announcement deleted" });
};
