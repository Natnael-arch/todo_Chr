import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../../context/GeneralContextProvider";
import DatePicker from "./DatePicker";
import "./add.css";

const CreateTaskForm: React.FC = () => {
  const { session, initSession } = useSessionContext(); // Importing session and initSession
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    taskName: "",
    urgency: "",
    deadline: "",
  });

  useEffect(() => {
    const initializeSession = async () => {
      if (!session && initSession) {
        try {
          console.log("🔹 Initializing session on page load...");
          await initSession(); // Automatically initialize the session
        } catch (error) {
          console.error("⚠️ Failed to initialize session:", error);
        }
      }
    };

    initializeSession();
  }, [session, initSession]); // Dependency array ensures this runs only when `session` or `initSession` changes

  const handleDateChange = (date: string) => {
    setFormData((prevData) => ({ ...prevData, deadline: date }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { taskName, urgency, deadline } = formData;

    if (!taskName || !urgency || !deadline) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      setIsLoading(true);

      if (!session) {
        alert("Session not initialized. Please reload the page.");
        return;
      }

      console.log("🔹 Submitting task...");
      await session.call({
        name: "add_task",
        args: [formData.taskName, formData.deadline, formData.urgency],
      });

      alert("✅ Task successfully added!");
      navigate("/home"); // Redirect to home page after task is added
    } catch (error) {
      console.error("⚠️ Error submitting task:", error);
      alert("Failed to add task. Please try again.");
    } finally {
      setIsLoading(false);
      setFormData({ taskName: "", urgency: "", deadline: "" });
    }
  };

  return (
    <div className="add">
      <div className="add-container">
        <div className="add-header">Add a Task</div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="task-name">
            <span>Task Name:</span>
            <input
              name="taskName"
              placeholder="Task Name"
              value={formData.taskName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="urgency">
            <span>Urgency:</span>
            <div className="check">
              <input
                type="radio"
                id="urgent"
                name="urgency"
                value="urgent"
                checked={formData.urgency === "urgent"}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="urgent">Urgent</label>
            </div>
            <div className="check">
              <input
                type="radio"
                id="not-urgent"
                name="urgency"
                value="not urgent"
                checked={formData.urgency === "not urgent"}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="not-urgent">Not Urgent</label>
            </div>
          </div>

          <div className="deadline">
            <span>Pick the Deadline:</span>
            <DatePicker onDateChange={handleDateChange} />
            {formData.deadline && <p>Selected Date: {formData.deadline}</p>}
          </div>

          <button type="submit" className="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
