const router = require("express").Router();
const c = require("../controllers/announcementController");
const { protect, authorize } = require("../middleware/authMiddleware");
router.use(protect);
router.get("/", c.getAll);
router.post("/", authorize("HR", "Manager"), c.create);
router.put("/:id", authorize("HR", "Manager"), c.update);
router.delete("/:id", authorize("HR", "Manager"), c.remove);
module.exports = router;
