import React, { useState } from 'react';
import './EditTaskModal.css';

interface EditTaskProps {
  task: { id:any; task_name: string; description: string; deadline: string; priority:string; status: string };
  onClose: () => void;
  onSave: (updatedTask: { id: string; description: string; task_name: string; deadline: string; priority: string; status: string; }) => void;
}

const EditTaskModal: React.FC<EditTaskProps> = ({ task, onClose, onSave }) => {
  const [taskName, setTaskName] = useState(task.task_name);
  const [deadline, setDeadline] = useState(task.deadline);
  const [priority, setpriority] = useState(task.priority);

  const handleSave = () => {
    onSave({
      ...task,
      task_name: taskName,
      deadline,
      priority,
    });
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Edit Task</h2>
        <form className="popup-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Task Name:
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="popup-input"
            />
          </label>
          <label>
            Deadline:
            <input
              type="text"
              placeholder='format: YYYY-MM-DD'
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="popup-input"
            />
          </label>
          <label>
            Urgency:
            <input
              type="text"
              placeholder='Either "urgent" or "not urgent"'
              value={priority}
              onChange={(e) => setpriority(e.target.value)}
              className="popup-input"
            />
          </label>
          <div className="popup-buttons">
            <button type="button" className="popup-close" onClick={onClose}>Cancel</button>
            <button type="button" className="popup-save" onClick={handleSave}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
