const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const TaskController = require("../controllers/TaskController");

router.get("/", auth, TaskController.getAllTasks);
router.post("/", auth, TaskController.createTask);
router.delete("/:id", auth, TaskController.deleteTask);
router.put("/:id", auth, TaskController.updateTask);
router.patch("/:id/complete", auth, TaskController.markTaskCompleted);

module.exports = router;