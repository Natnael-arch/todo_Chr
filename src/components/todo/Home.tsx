import React, { FormEvent, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import TodoRight from "./TodoRight";

interface Task {
  text: string;
  completed: boolean;
}

const Home: React.FC = () => {
  const [activeTab, setActiveTab]= useState('add')
  const navigate = useNavigate();

  // Handle adding a task
  const handleAddTask = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("handle task");
  };

  // Handle navigation clicks
  const onNavClick = (active: string): void => {
    setActiveTab(active);
  };

  return (
    <div className="todo-wrapper">
      {/* <span className="header-title">TODO Dapp</span> */}
      <div className="todo-container flexColCenter">
        {/* Left container */}
        <div className="todo-left flexCenter">
          <div className="header flexColCenter">
            <span className="header-title">TODO Dapp</span>
            {/* <span className="header-desc">Plan your day with us</span> */}
          </div>
          <div className="catagories flexCenter">
            <span className="row" onClick={() => onNavClick("add")}>Add</span>
            <span className="row" onClick={() => onNavClick("urgent")}>Urgent</span>
            <span className="row" onClick={() => onNavClick("all")}>All</span>
            <span className="row" onClick={() => onNavClick("completed")}>Completed</span>
            {/* <span className="row" onClick={() => onNavClick("weekly")}>Weekly Plans</span>
            <span className="row" onClick={() => onNavClick("daily")}>Daily Plans</span> */}
          </div>
          <div className="nav-right flexCenter">
            <div className="theme">
              theme
            </div>
            <div className="user">
              user
            </div>
          </div>
        </div>

        {/* Right container */}
        <div className="todo-right">{<TodoRight active={activeTab}/>}</div>
      </div>
    </div>
  );
};

export default Home;
