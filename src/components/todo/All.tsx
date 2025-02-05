import { useEffect, useState } from "react";
import { useQuery } from "./queryhook";
import { useSessionContext } from "../../context/GeneralContextProvider";
import EditTaskModal from "./EditTaskModal";
import "./all.css";

type TaskData = { id:any; task_name: string; description: string; deadline: string; priority:string; status: string };

export default function TaskList() {
  const { session } = useSessionContext();
  const accountId = session?.account?.id;

  const [edit, setEdit] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskData | null>(null);
  const [sortState, setSortState] = useState<"off" | "asc" | "desc">("off");
  const [sortedTasks, setSortedTasks] = useState<TaskData[]>([]);

  // Fetch tasks using the `get_tasks` query
  const { result: taskData, reload: reloadTasks } = useQuery<TaskData[]>(
    "get_tasks",
    accountId ? { user_id: accountId } : undefined
  );

  // Auto-refresh tasks every 10 seconds
  useEffect(() => {
    const refreshTasks = setInterval(() => {
      reloadTasks();
    }, 900000);
    return () => clearInterval(refreshTasks);
  }, [reloadTasks]);

  // Sort function
  useEffect(() => {
    if (!taskData) return;

    let sorted = [...taskData];
    if (sortState === "asc") {
      sorted.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortState === "desc") {
      sorted.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
    }

    setSortedTasks(sorted);
  }, [taskData, sortState]);

  // Handle edit
  const onEdit = (task: TaskData) => {
    console.log(task)
    setTaskToEdit(task);
    setEdit(true);
  };

  // Handle save after editing
  const handleSaveTask = async (updatedTask: TaskData) => {
    if (!taskToEdit) return;

  const fullUpdatedTask = { ...taskToEdit, ...updatedTask }; 
  console.log(fullUpdatedTask.id)

  try {
    await session?.call({
      name: "update_task",
      args: [
        fullUpdatedTask.id,
        fullUpdatedTask.task_name,
        fullUpdatedTask.description,
        fullUpdatedTask.deadline,
        fullUpdatedTask.priority,
        fullUpdatedTask.status,
      ],
    });
    alert("✅ Task updated successfully!");
    reloadTasks();
  } catch (error) {
    console.error("⚠️ Error updating task:", error);
    alert("❌ Failed to update task.");
  }
  console.log("Updated task:", fullUpdatedTask);
  setEdit(false);
  };

  // Handling delete button
  const onDelete = async(task: TaskData) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await session?.call({ name: "delete_task", args: [task.id] });
      alert("✅ Task deleted successfully!");
      reloadTasks();
    } catch (error) {
      console.error("⚠️ Error deleting task:", error);
      alert("❌ Failed to delete task.");
    }
  };

  // Handle completed tasks
  const onComplete = async (task: TaskData) => {
    try {
      await session?.call({
        name: "update_task",
        args: [
          task.id,
          task.task_name,
          task.description,
          task.deadline,
          task.priority,
          "complete", // Change status to "complete"
        ],
      });
      alert("✅ Task marked as complete!");
      reloadTasks(); // Refresh only if update succeeds
    } catch (error) {
      console.error("⚠️ Error updating task:", error);
      alert("❌ Failed to mark task as complete.");
    }
  };
  

  // Toggle sorting state
  const onSortClick = () => {
    setSortState((prev) =>
      prev === "off" ? "asc" : prev === "asc" ? "desc" : "off"
    );
  };

  return (
    <div className="p-4 md:p-8 container">
      <h1 className="title">All Tasks</h1>
      <button className={`sort ${sortState}`} onClick={onSortClick}>
        Sort by deadline ({sortState === "off" ? "None" : sortState === "asc" ? "Ascending" : "Descending"})
      </button>

      <div className="task-container bg-white p-4 rounded-lg shadow">
        <div className="listContainer">
          {Array.isArray(sortedTasks) && sortedTasks.length > 0 ? (
            sortedTasks.map((task, index) => (
              <div className="taskList mb-4" key={index}>
                <div className="taskData">
                  <div className="font-semibold"><h4>Task: </h4>{task.task_name}</div>
                  <div><h4>Deadline: </h4>{task.deadline}</div>
                  <div><h4>Urgency: </h4> {task.priority}</div>
                </div>
                <div className="buttons flexCenter">
                  <button className="button" onClick={() => onComplete(task)}>Done</button>
                  <button className="button" onClick={() => onEdit(task)}>Edit</button>
                  <button className="button" onClick={() => onDelete(task)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p className="error">{taskData && taskData.length === 0 ? "No tasks available for this user." : "Loading tasks..."}</p>
          )}
        </div>
      </div>

      {edit && taskToEdit && (
        <EditTaskModal task={taskToEdit} onClose={() => setEdit(false)} onSave={handleSaveTask} />
      )}
    </div>
  );
}
