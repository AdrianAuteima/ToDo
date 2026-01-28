import '../dashboard.css';

const formatDate = (timestamp) => {
  if (!timestamp) return "-";

  const date = new Date(Number(timestamp)); // convertir milisegundos a Date

  const pad = (num) => num.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear().toString().slice(-2);

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};



const TaskTable = ({ 
    tasks, 
    editingId, 
    editTitle, 
    editDescription, 
    setEditTitle, 
    setEditDescription,
    onComplete, 
    onEdit, 
    onSave, 
    onCancel,
    onDelete 
}) => {
  if (tasks.length === 0) {
    return <div className="no-tasks"><p>No hay tareas. ¡Crea una nueva!</p></div>;
  }
  console.log(tasks)

  return (
    <div className="table-container">
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Estado</th>
            <th>Tarea</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className={task.completed ? "completed-row" : ""}>
              <td>
                <input type="checkbox" checked={task.completed} onChange={() => onComplete(task._id)} />
              </td>
              <td>
                {editingId === task._id ? (
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                ) : (
                  <span className={task.completed ? "task-completed" : ""}>{task.title}</span>
                )}
              </td>
              <td>
                {editingId === task._id ? (
                  <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows="2" />
                ) : (
                  <span>{task.description || "-"}</span>
                )}
              </td>
              <td>{formatDate(task.updatedAt)}</td>
              <td>
                {editingId === task._id ? (
                  <>
                    <button className="btn btn-success btn-sm" onClick={() => onSave(task._id)}>Guardar</button>
                    <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancelar</button>
                  </>
                ) : (
                  <>
                    {!task.completed && (
                      <button className="btn btn-info btn-sm" onClick={() => onEdit(task)}>Editar</button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(task._id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
