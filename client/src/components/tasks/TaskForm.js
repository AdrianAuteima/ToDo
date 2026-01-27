import '../dashboard.css';

const TaskForm = ({
    taskTitle,
    setTaskTitle,
    taskDescription,
    setTaskDescription,
    onSubmit
}) => {
    return (
        <form className="add-task-form" onSubmit={onSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Título de la tarea"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="input-field"
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="textarea-field"
          rows="3"
        />
        <button type="submit" className="btn btn-primary">
          Agregar Tarea
        </button>
      </div>
    </form>
    );
};
export default TaskForm;