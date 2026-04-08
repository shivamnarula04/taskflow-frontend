import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/tasks";

interface Task {
  id?: number;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  completed: boolean;
  dueDate?: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  const createTask = async () => {
    if (!title) return;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, priority, completed: false }),
    });
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    fetchTasks();
  };

  const toggleComplete = async (task: Task) => {
    await fetch(`${API_URL}/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h1 style={{ textAlign: "center" }}>TaskFlow</h1>

      {/* Add Task Form */}
      <div style={{ background: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
        </select>
        <button
          onClick={createTask}
          style={{ width: "100%", padding: "10px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      {tasks.map((task) => (
        <div key={task.id} style={{
          background: task.completed ? "#e8f5e9" : "white",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "15px",
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <h3 style={{ margin: 0, textDecoration: task.completed ? "line-through" : "none" }}>{task.title}</h3>
            <p style={{ margin: "4px 0", color: "#666" }}>{task.description}</p>
            <span style={{
              fontSize: "12px",
              padding: "2px 8px",
              borderRadius: "12px",
              background: task.priority === "HIGH" ? "#ffebee" : task.priority === "MEDIUM" ? "#fff3e0" : "#e8f5e9",
              color: task.priority === "HIGH" ? "#c62828" : task.priority === "MEDIUM" ? "#e65100" : "#2e7d32"
            }}>{task.priority}</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => toggleComplete(task)}
              style={{ padding: "6px 12px", background: task.completed ? "#757575" : "#4caf50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              {task.completed ? "Undo" : "Done"}
            </button>
            <button onClick={() => deleteTask(task.id!)}
              style={{ padding: "6px 12px", background: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Delete
            </button>
          </div>
        </div>
      ))}

      {tasks.length === 0 && <p style={{ textAlign: "center", color: "#999" }}>No tasks yet. Add one above!</p>}
    </div>
  );
}

export default App;