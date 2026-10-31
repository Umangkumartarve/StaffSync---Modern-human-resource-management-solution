const router = require("express").Router();
const c = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/authMiddleware");
router.use(protect);
router.post("/mark", c.mark);
router.get("/my", c.mine);
router.get("/summary", authorize("HR"), c.summary);
router.get("/", authorize("HR"), c.all);
module.exports = router;
