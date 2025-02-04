import React, { useState, FormEvent } from "react";
import "./todo.css";

interface Task {
  text: string;
  completed: boolean;
}

const Todo: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  const handleAddTask = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (index: number): void => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (index: number): void => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="todo-container-dark">
      <div className="background-glow"></div>
      <div className="todo-card-dark">
        <header className="todo-header-dark">
          <h1>My To-Do List</h1>
          <p>Stay organized and productive</p>
        </header>
        <form className="todo-form-dark" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>
        <ul className="todo-list-dark">
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`todo-item-dark ${
                task.completed ? "completed-dark" : ""
              }`}
            >
              <span onClick={() => toggleTask(index)}>{task.text}</span>
              <button onClick={() => deleteTask(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
