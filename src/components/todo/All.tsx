import { useEffect } from "react";
import { useQuery } from "./queryhook"
import { useSessionContext } from "../../context/GeneralContextProvider";

export default function TaskList() {
  const { session } = useSessionContext();
  const accountId = session?.account?.id; // Retrieve the user/account ID from the session

  // Fetch tasks using the `get_tasks` query with the user's account ID
  const { result: taskData, reload: reloadTasks } = useQuery<
    { task_name: string; deadline: string; urgency: string }[]
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

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
        <ul>
          {Array.isArray(taskData) && taskData.length > 0 ? (
            taskData.map((task, index) => (
              <li className="mb-4" key={index}>
                <div className="font-semibold">{task.task_name}</div>
                <div>Deadline: {task.deadline}</div>
                <div>Urgency: {task.urgency}</div>
                <hr className="my-4 border-t border-gray-300" />
              </li>
            ))
          ) : (
            <p>{taskData ? "No tasks available for this user." : "Loading tasks..."}</p>
          )}
        </ul>
      </div>
    </div>
  );
}
