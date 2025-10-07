const Task = require("../models/Task");

// 🧩 GET all tasks (with pagination, role-based access & date filter)
exports.getTasks = async (req, res) => {
  try {
    // Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Date filters
    const { startDate, endDate, dateField } = req.query;
    // dateField cho phép chọn giữa "createdAt" hoặc "dueDate"
    const dateFilterField = dateField === "createdAt" ? "createdAt" : "dueDate";

    // Role-based filter: admin xem tất cả, user chỉ xem task của mình
    const query = req.user.role === "admin" ? {} : { user: req.user.id };

    // Nếu có khoảng thời gian được chọn
    if (startDate || endDate) {
      query[dateFilterField] = {};
      if (startDate) query[dateFilterField].$gte = new Date(startDate);
      if (endDate) query[dateFilterField].$lte = new Date(endDate);
    }

    // Đếm tổng số task thỏa điều kiện
    const total = await Task.countDocuments(query);

    // Lấy danh sách task theo trang
    const tasks = await Task.find(query)
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      tasks,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🧩 CREATE task
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user.id,
    });
    await task.save();
    res.json(task);
  } catch (err) {
    console.error("❌ Error creating task:", err);
    res.status(500).json({ msg: "Failed to create task" });
  }
};

// 🧩 UPDATE task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    // chỉ chủ sở hữu hoặc admin được sửa
    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    // Cập nhật các trường
    task.title = req.body.title || task.title;
    task.status = req.body.status || task.status;
    task.dueDate = req.body.dueDate || task.dueDate;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error("❌ Error updating task:", err);
    res.status(500).json({ msg: "Failed to update task" });
  }
};

// 🧩 DELETE task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    // chỉ chủ sở hữu hoặc admin được xóa
    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ msg: "Task deleted" });
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    res.status(500).json({ msg: "Failed to delete task" });
  }
};
