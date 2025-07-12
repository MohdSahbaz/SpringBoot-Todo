import { useEffect, useState } from "react";
import axios from "axios";

const Task = ({ setIsLoggedIn }) => {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    task: "",
    description: "",
    priority: "low",
  });

  const [updateTask, setUpdateTask] = useState({
    task: "",
    description: "",
    priority: "",
  });
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const userId = localStorage.getItem("userid");
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/tasks/user-tasks",
          {
            headers: {
              Authorization: "Basic " + btoa(username + ":" + password),
              userId: userId,
            },
          }
        );
        setTasks(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/tasks/create",
        newTask,
        {
          headers: {
            Authorization: "Basic " + btoa(username + ":" + password),
            userId: userId,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setNewTask({ task: "", description: "", priority: "low" });
      setShowForm(false);
    } catch (err) {
      alert("Error creating task");
      console.error(err);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/tasks/update?taskId=${updateTask.id}`,
        updateTask,
        {
          headers: {
            Authorization: "Basic " + btoa(username + ":" + password),
            userId: userId,
          },
        }
      );
      // Update the task list
      const updatedList = tasks.map((task) =>
        task.id === updateTask.id ? response.data : task
      );
      setTasks(updatedList);
      setUpdateTask({ task: "", description: "" });
      setShowUpdateForm(false);
    } catch (err) {
      alert("Error while updating task");
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/delete`, {
        params: { taskId },
        headers: {
          Authorization: "Basic " + btoa(username + ":" + password),
        },
      });
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 font-sans relative">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-6">
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-xl flex items-center gap-4 w-full flex-wrap">
          <div className="flex flex-wrap gap-4 md:flex-row flex-col">
            <img
              src="zenitsu.png"
              alt="Profile"
              className="w-14 h-14 rounded-full border-2 border-white shadow mx-auto"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{username}</h2>
              <p className="text-sm text-gray-300">Your Task Dashboard</p>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap w-full">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r flex-1 from-blue-500 to-purple-600 px-4 py-2 rounded-lg text-white hover:scale-105 transition-transform"
            >
              {showForm ? "Close" : "Add Task"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r flex-1 from-red-500 to-rose-600 px-4 py-2 rounded-lg text-white hover:scale-105 transition-transform"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Task Form */}
      {showForm && (
        <form
          onSubmit={handleAddTask}
          className="absolute top-28 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-6 w-full md:max-w-md max-w-[310px] z-50 text-white border border-white/20"
        >
          <h3 className="text-xl font-bold mb-4">Create New Task</h3>
          <input
            type="text"
            placeholder="Task Title"
            className="w-full mb-3 p-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none placeholder:text-white/70"
            value={newTask.task}
            onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full mb-3 p-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none placeholder:text-white/70"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          ></textarea>
          <select
            className="w-full mb-3 p-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none placeholder:text-white/70"
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
          >
            <option value="low" className="text-black">
              Low
            </option>
            <option value="medium" className="text-black">
              Medium
            </option>
            <option value="high" className="text-black">
              High
            </option>
          </select>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 rounded-lg hover:scale-[1.02] transition-transform"
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-red-500 hover:underline transition-all duration-300 mt-2"
          >
            Close
          </button>
        </form>
      )}

      {/* Update Task Form */}
      {showUpdateForm && (
        <form
          onSubmit={handleUpdateTask}
          className="absolute top-28 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-6 w-full md:max-w-md max-w-[310px] z-50 text-white border border-white/20"
        >
          <h3 className="text-xl font-bold mb-4">Update Task</h3>
          <input
            type="text"
            placeholder="Task Title"
            className="w-full mb-3 p-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none placeholder:text-white/70"
            value={updateTask.task}
            onChange={(e) =>
              setUpdateTask({ ...updateTask, task: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            className="w-full mb-3 p-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none placeholder:text-white/70"
            value={updateTask.description}
            onChange={(e) =>
              setUpdateTask({ ...updateTask, description: e.target.value })
            }
          ></textarea>
          <select
            name=""
            id=""
            className="w-full mb-3 p-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none placeholder:text-white/70"
            value={updateTask.priority}
            onChange={(e) =>
              setUpdateTask({ ...updateTask, priority: e.target.value })
            }
          >
            <option value="low" className="text-black">
              Low
            </option>
            <option value="medium" className="text-black">
              Medium
            </option>
            <option value="high" className="text-black">
              High
            </option>
          </select>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 rounded-lg hover:scale-[1.02] transition-transform"
          >
            Update Task
          </button>
          <button
            type="button"
            onClick={() => setShowUpdateForm(false)}
            className="text-red-500 hover:underline transition-all duration-300 mt-2"
          >
            Close
          </button>
        </form>
      )}

      {/* Task Cards */}
      <div className="mt-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-300">Loading tasks...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-300">No tasks found.</div>
        ) : (
          <div className="grid gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-5 shadow-lg flex justify-between items-start border border-white/10 ${
                  task.priority === "high"
                    ? "bg-red-500/20"
                    : task.priority === "medium"
                    ? "bg-orange-500/30"
                    : "bg-emerald-500/20"
                }`}
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {task.task}
                  </h3>
                  <p className="text-sm text-gray-300">{task.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {/* <button
                    onClick={() => deleteTask(task.id)}
                    className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Done
                  </button> */}
                  <button
                    onClick={() => {
                      setUpdateTask(task);
                      setShowUpdateForm(true);
                    }}
                    className="text-xs px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <footer className="mt-10 bg-gray-900 text-white py-4">
        <div className="text-center space-y-1 text-sm">
          <p>© {new Date().getFullYear()} Mohd Sahbaz</p>
          <p>Project created to learn Spring Boot</p>
        </div>
      </footer>
    </div>
  );
};

export default Task;
