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
      <div className="todo-container flexCenter">
        {/* Left container */}
        <div className="todo-left">
          <div className="header flexColCenter">
            <span className="header-title">TODO Dapp</span>
            <span className="header-desc">Plan your day with us</span>
          </div>
          <hr />
          <div className="catagories flexColCenter">
            <span className="row" onClick={() => onNavClick("add")}>Add An Item</span>
            <span className="row" onClick={() => onNavClick("urgent")}>Urgent</span>
            <span className="row" onClick={() => onNavClick("all")}>All</span>
            {/* <span className="row" onClick={() => onNavClick("weekly")}>Weekly Plans</span>
            <span className="row" onClick={() => onNavClick("daily")}>Daily Plans</span> */}
          </div>
        </div>

        {/* Right container */}
        <div className="todo-right">{<TodoRight active={activeTab}/>}</div>
      </div>
    </div>
  );
};

export default Home;
