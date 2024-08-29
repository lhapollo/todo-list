import React from "react";
import { nanoid } from "nanoid";
import ToDoItem from "./ToDoItem.jsx";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";

function getFormattedDate(date) {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date object");
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format time
  const formattedHours = String(hours).padStart(2, "0");

  // Return formatted date and time
  return `${formattedHours}:${minutes} ${ampm}, ${day}/${month}/${year}`;
}

export default function ToDoList() {
  const [tasks, setTasks] = React.useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );

  const [text, setText] = React.useState("");
  const [showIncomplete, setShowIncomplete] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [editText, setEditText] = React.useState("");

  React.useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function toggleCompleted(id) {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        } else {
          return task;
        }
      })
    );
  }

  function addTask(text) {
    if (text.length === 0) return;
    else {
      setTasks((prevTasks) => [
        {
          id: nanoid(),
          text,
          completed: false,
          date: new Date(),
          timestamp: getFormattedDate(new Date()),
        },
        ...prevTasks,
      ]);
      setText("");
    }
  }

  function startEdit(id, text) {
    setEditId(id);
    setEditText(text);
  }

  function saveEdit(id) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          return { ...task, text: editText };
        } else {
          return task;
        }
      })
    );
    setEditId(null);
    setEditText("");
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      addTask(text);
    }
  }

  return (
    <div className="tdl">
      <h1 className="tdl--title">To Do List</h1>

      <div className="tdl--input-container">
        <button className="tdl--btn" onClick={() => addTask(text)}>
          Add Task
        </button>
        <input
          className="tdl--add-task"
          value={text}
          placeholder='ex: "Do laundry"'
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Dropdown className="tdl--dropdown">
          <Dropdown.Toggle
            className="dropdown-toggle"
            variant="success"
            id="dropdown-filter"
          >
            Filter Tasks
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu">
            <Dropdown.Item
              className={showIncomplete ? "bold-text" : ""}
              onClick={() => setShowIncomplete(true)}
            >
              Incomplete
            </Dropdown.Item>
            <Dropdown.Item
              className={showIncomplete ? "" : "bold-text"}
              onClick={() => setShowIncomplete(false)}
            >
              All Tasks
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="tdl--item-container">
        {tasks.map((task) => {
          if (showIncomplete) {
            return (
              task.completed === false && (
                <ToDoItem
                  key={task.id}
                  task={task}
                  toggleCompleted={toggleCompleted}
                  deleteTask={deleteTask}
                  editId={editId}
                  editText={editText}
                  startEdit={startEdit}
                  saveEdit={saveEdit}
                  setEditId={setEditId}
                  setEditText={setEditText}
                />
              )
            );
          } else {
            return (
              <ToDoItem
                key={task.id}
                task={task}
                toggleCompleted={toggleCompleted}
                deleteTask={deleteTask}
                editId={editId}
                editText={editText}
                saveEdit={saveEdit}
                startEdit={startEdit}
                setEditId={setEditId}
                setEditText={setEditText}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
