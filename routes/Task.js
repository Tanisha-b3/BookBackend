const express = require("express");
const { protect } = require("../Middleware/Auth.js");
const Task = require("../Model/Task.js");

const router = express.Router();

// Get all tasks (with search, filter, pagination)
router.get("/", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status || "all";

    // Query by user
    let query = { user: req.user._id };

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter
    if (status !== "all") {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      tasks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
    });
  } catch (error) {
    console.error("Error in GET /tasks:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create task
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      user: req.user._id,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error("Error in POST /tasks:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update task
router.put("/:id", protect, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    // Ensure task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, task });
  } catch (error) {
    console.error("Error in PUT /tasks/:id:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    // Ensure task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, error: "Not authorized" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ success: true, data: {} });
  } catch (error) {
    console.error("Error in DELETE /tasks/:id:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
