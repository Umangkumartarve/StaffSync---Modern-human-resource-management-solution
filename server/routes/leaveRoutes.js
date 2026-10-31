const router = require("express").Router();
const c = require("../controllers/leaveController");
const { protect, authorize } = require("../middleware/authMiddleware");
router.use(protect);
router.post("/", c.apply);
router.get("/my", c.myLeaves);
router.get("/", authorize("HR", "Manager"), c.all);
router.put("/:id/status", authorize("HR", "Manager"), c.updateStatus);
module.exports = router;
