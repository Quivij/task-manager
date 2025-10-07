import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ States
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  // Date Filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateField, setDateField] = useState("dueDate");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🧩 Fetch tasks
  const fetchTasks = async (pageNumber = 1, filterStatus = filter) => {
    try {
      const data = await getTasks(
        user.token,
        pageNumber,
        5,
        startDate,
        endDate,
        dateField
      );

      let fetchedTasks = Array.isArray(data.tasks) ? data.tasks : [];
      if (filterStatus !== "all") {
        fetchedTasks = fetchedTasks.filter((t) => t.status === filterStatus);
      }

      setTasks(fetchedTasks);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("⚠️ Failed to fetch tasks!");
      setTasks([]);
    }
  };

  useEffect(() => {
    if (!user?.token) navigate("/");
    else fetchTasks();
  }, [user, navigate]);

  // 🧩 Add Task
  const addTask = async () => {
    if (!title.trim()) return toast.error("Title is required!");
    try {
      await createTask({ title, dueDate }, user.token);
      toast.success("📝 Task added!");
      setTitle("");
      setDueDate("");
      fetchTasks(page);
    } catch {
      toast.error("❌ Failed to add task!");
    }
  };

  // 🧩 Toggle status
  const toggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      await updateTask(task._id, { status: newStatus }, user.token);
      toast.success(`✅ Task marked as ${newStatus}`);
      fetchTasks(page);
    } catch {
      toast.error("❌ Failed to update task!");
    }
  };

  // 🧩 Delete task (toast confirm)
  const handleDelete = async (id) => {
    toast((t) => (
      <div
        className={`flex flex-col gap-2 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        <p>🗑️ Are you sure you want to delete this task?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={async () => {
              toast.dismiss(t.id);
              await toast.promise(deleteTask(id, user.token), {
                loading: "Deleting...",
                success: "✅ Task deleted!",
                error: "❌ Failed to delete!",
              });
              fetchTasks(page);
            }}
          >
            Yes
          </button>
          <button
            className={`${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-300"
            } px-3 py-1 rounded`}
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  // 🧩 Edit Task
  const startEdit = (task) => setEditingTask(task);
  const saveEdit = async () => {
    if (!editingTask.title.trim()) return toast.error("Title is required!");
    try {
      await updateTask(editingTask._id, editingTask, user.token);
      toast.success("✏️ Task updated!");
      setEditingTask(null);
      fetchTasks(page);
    } catch {
      toast.error("❌ Failed to update task!");
    }
  };

  // 🧩 Logout
  const handleLogout = () => {
    logout();
    toast("👋 Logged out!");
    navigate("/");
  };

  // 🧩 Filter by date
  const handleDateFilter = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("❌ Start date cannot be after end date!");
      return;
    }
    setPage(1);
    fetchTasks(1);
  };

  // 🧩 Toggle Dark Mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Task Dashboard{" "}
          <span className="text-blue-400">
            {user?.role === "admin" ? "(Admin)" : "(User)"}
          </span>
        </h1>
        <div className="flex gap-3">
          <button
            onClick={toggleDarkMode}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔹 Date Filter */}
      <div
        className={`p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3 items-center ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div>
          <label className="text-sm mr-2">Date Type:</label>
          <select
            value={dateField}
            onChange={(e) => setDateField(e.target.value)}
            className="border rounded p-2 bg-transparent"
          >
            <option value="dueDate">Due Date</option>
            <option value="createdAt">Created Date</option>
          </select>
        </div>

        <div>
          <label className="text-sm mr-2">Start:</label>
          <input
            type="date"
            className="border rounded p-2 bg-transparent"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm mr-2">End:</label>
          <input
            type="date"
            className="border rounded p-2 bg-transparent"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          onClick={handleDateFilter}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply Filter
        </button>
      </div>

      {/* Add Task */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border p-2 rounded bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task"
        />
        <input
          type="date"
          className="border p-2 rounded bg-transparent"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {["all", "pending", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              fetchTasks(page, status);
            }}
            className={`px-4 py-2 rounded border ${
              filter === status
                ? "bg-blue-500 text-white"
                : "bg-transparent text-gray-300 border-gray-500"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      {!tasks || tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li
              key={t._id}
              className={`p-4 border rounded-lg shadow-sm flex justify-between items-center ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div>
                <div className="font-medium">
                  <span
                    className={`${
                      t.status === "completed"
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {t.title}
                  </span>
                  {t.dueDate && (
                    <span className="ml-3 text-sm text-gray-400">
                      📅 {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-400">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      t.status === "completed"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {t.status}
                  </span>
                  {user?.role === "admin" && (
                    <span className="ml-2 text-blue-400">
                      by {t.user?.username}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(t)}
                  className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                >
                  {t.status === "pending" ? "Complete" : "Undo"}
                </button>
                <button
                  onClick={() => startEdit(t)}
                  className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-3">
        <button
          disabled={page <= 1}
          onClick={() => fetchTasks(page - 1)}
          className={`px-4 py-2 rounded ${
            page <= 1
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Prev
        </button>
        <span className="font-medium">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => fetchTasks(page + 1)}
          className={`px-4 py-2 rounded ${
            page >= totalPages
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
          <div
            className={`p-6 rounded-lg shadow-lg w-96 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <input
              className="w-full border p-2 rounded mb-3 bg-transparent"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
            />
            <input
              type="date"
              className="w-full border p-2 rounded mb-3 bg-transparent"
              value={
                editingTask.dueDate
                  ? new Date(editingTask.dueDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEditingTask({ ...editingTask, dueDate: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
