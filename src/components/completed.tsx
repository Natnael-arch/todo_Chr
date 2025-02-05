import { useEffect, useState } from "react";
import { useQuery } from "./todo/queryhook";
import { useSessionContext } from "../context/GeneralContextProvider";
import EditTaskModal from "./todo/EditTaskModal";
import './todo/all.css';

interface Task {
  task_name: string;
  deadline: string;
  status: string;
}
type data={ id:any; task_name: string; description: string; deadline: string; priority:string; status: string };

const Completed: React.FC = () => {
  const { session } = useSessionContext();
  const accountId = session?.account?.id;
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [edit, setEdit]= useState(false)
  const [taskToEdit, setTaskToEdit] = useState<{ task_name: string; deadline: string; status: string } | null>(null);

  // Fetch tasks using the `get_tasks` query with the user's account ID
  const { result: taskData, reload: reloadTasks } = useQuery<
    { task_name: string; deadline: string; status: string }[]
  >("get_tasks", accountId ? { user_id: accountId } : undefined);

  // Auto-refresh tasks every 10 seconds
  useEffect(() => {
    const refreshTasks = setInterval(() => {
      reloadTasks();
    }, 10000);
    return () => {
      clearInterval(refreshTasks);
    };
  }, [reloadTasks]);

  useEffect(() => {
    const filteredData = taskData?.filter(each => each.status === "complete") || [];
    
    // Log only if filtered data has changed
    if (JSON.stringify(filteredData) !== JSON.stringify(urgentTasks)) {
      console.log(filteredData);
      setUrgentTasks(filteredData);
    }
  }, [taskData, urgentTasks]);  // Add urgentTasks as dependency to compare changes

  return (
    <div className="p-4 md:p-8 container">
    <h1 className="title">Completed Tasks</h1>

    <div className="task-container bg-white p-4 rounded-lg shadow">
      <div className="listContainer">
        {Array.isArray(urgentTasks) && urgentTasks.length > 0 ? (
          urgentTasks.map((task, index) => (
            <div className="taskList mb-4" key={index}>
              <div className="taskData">
                <div className="font-semibold"><h4>Task: </h4>{task.task_name}</div>
                <div><h4>Deadline: </h4>{task.deadline}</div>
                <div><h4>Status: </h4> {task.status}</div>
              </div>
              {/* <div className="buttons flexCenter">
                <button className="button" onClick={()=> onComplete(task)}>Done</button>
                <button className="button" onClick={()=>onEdit(task)}>Edit</button>
                <button className="button" onClick={()=> onDelete(task)}>Delete</button>
              </div> */}
            </div>
          ))
        ) : (
          <p className="error">
            {urgentTasks && urgentTasks.length == 0
              ? "No completed tasks available for this user."
              : "Loading tasks..."}
          </p>
        )}
      </div>
    </div>
    {/* {edit && taskToEdit && (
        <EditTaskModal task={taskToEdit} onClose={() => setEdit(false)} onSave={handleSaveTask} />
      )} */}
  </div>
  )
};

export default Completed;
