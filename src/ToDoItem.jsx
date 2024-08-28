export default function ToDoItem(props) {
  const {
    task,
    toggleCompleted,
    deleteTask,
    startEdit,
    saveEdit,
    editId,
    editText,
    setEditText,
    setEditId,
  } = props;
  const { id, text, completed, timestamp } = task;

  function handleChange() {
    toggleCompleted(id);
  }

  function handleEditChange(event) {
    setEditText(event.target.value);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      saveEdit(id);
    } else if (event.key === "Escape") {
      startEdit(null, "");
    }
  }

  return (
    <div className="tdl-item">
      <div className="tdl-item--left">
        <div className="tdl-item--checkbox-container">
          <input
            className="tdl-item--checkbox"
            type="checkbox"
            checked={completed}
            onChange={handleChange}
          />
        </div>
        {editId === id ? (
          <div className="tdl-item--info">
            <input
              value={editText}
              onChange={handleEditChange}
              onKeyDown={handleKeyDown}
              className="tdl-item--edit-text"
            />
            <p className="tdl-item--timestamp">{timestamp}</p>
          </div>
        ) : (
          <div className="tdl-item--info">
            <h1 className={`tdl-item--text ${completed ? "completed" : ""}`}>
              {text}
            </h1>
            <p className="tdl-item--timestamp">{timestamp}</p>
          </div>
        )}
      </div>
      {editId === id ? (
        <div className="tdl-item--right">
          <button className="tdl-item--btn" onClick={() => saveEdit(id)}>
            <img src={"/confirm.png"} width="35px"/>
          </button>
          <button className="tdl-item--btn" onClick={() => startEdit(null, "")}>
          <img src={"/cancel.png"} width="35px"/>
          </button>
        </div>
      ) : (
        <div className="tdl-item--right">
          <button className="tdl-item--btn" onClick={() => deleteTask(id)}>
            <img src={"/delete.png"} />
          </button>
          <button className="tdl-item--btn" onClick={() => startEdit(id, text)}>
            <img src={"/edit.png"} />
          </button>
        </div>
      )}
    </div>
  );
}
