import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask } from "../api/taskApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.token) {
      getTasks(user.token).then(setTasks);
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      const newTask = await createTask({ title }, user.token);
      setTasks([...tasks, newTask]);
      setTitle("");
      toast.success("📝 Task added successfully!");
    } catch {
      toast.error("❌ Failed to add task!");
    }
  };

  const handleLogout = () => {
    logout();
    toast("👋 Logged out!", { icon: "🚪" });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Task Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task"
        />
        <button
          onClick={addTask}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((t) => (
          <li
            key={t._id}
            className="p-3 border rounded bg-white shadow-sm flex justify-between"
          >
            <span>{t.title}</span>
            <span className="text-sm text-gray-500">{t.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
