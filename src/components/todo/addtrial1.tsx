import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../../context/GeneralContextProvider";
import DatePicker from "./DatePicker";
import "./add.css";
import { createClient } from "postchain-client";
const CreateTaskForm: React.FC = () => {
  const { session } = useSessionContext(); // Getting session from context
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    taskName: "",
    urgency: "",
    deadline: "",
  });

  useEffect(() => {
    const userSession = localStorage.getItem("session");
    if (!userSession) {
      // If no session, redirect to login
      navigate("/");
    }
  }, [navigate]);

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

      // Check if session exists (this is redundant as we already check above, but for double safety)
      if (!session) {
        alert("🛑 No session found. Please log in first.");
        navigate("/"); // Redirect to login if no session
        return;
      }
      //  const nodeUrl = import.meta.env.VITE_NODE_URL || "https://testnet4-dapps.chromia.dev:7740";
      //         const blockchainRid = import.meta.env.VITE_BRID || "ED381DD59C955A5C42A8562C5BD68FEE7CAD1184B3C3D88517A81366DEB8283C";
      
      //         const client = await createClient({ directoryNodeUrlPool: nodeUrl, blockchainRid });
      // // Assuming you have a 'make_post' function to create a task
      // await client.query({
      //   name: "make_post",
      //   [formData],
      // });
      await session.call({
        name: "add_task",
        args: [formData],
      });

      alert("✅ Task successfully added!");
      navigate("/"); // Redirect to home page after task is added
    } catch (error) {
      console.error("⚠️ Error submitting task:", error);
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
