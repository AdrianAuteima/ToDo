import React, { useEffect, useState } from "react";
import TaskTable from "../components/tasks/taskTable";
import TaskForm from "../components/tasks/TaskForm";


const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = getToken();
            console.log('Token:', token);
            const response = await fetch("http://localhost:3001/api/tasks", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log('Response data:', data);
            setTasks(data.tasks || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const token = getToken();
            const response = await fetch("http://localhost:3001/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title: taskTitle, description: taskDescription }),
            });
            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Error al crear la tarea");
                return;
            }

            setTasks((prev) => [...prev, data.task]);
            setTaskTitle("");
            setTaskDescription("");
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Error al crear la tarea");
        }
    };

    const handleCompleteTask = async (_id) => {
        const task = tasks.find((t) => t._id === _id);
        if (!task) return;

        try {
            const token = getToken();
            const response = await fetch(`http://localhost:3001/api/tasks/${_id}/complete`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ completed: !task.completed }),
            });

            if (!response.ok) throw new Error("Error actualizando completed");

            const data = await response.json();
            setTasks((prev) => prev.map((t) => (t._id === _id ? data.task : t)));
        } catch (error) {
            console.error("Error completing task:", error);
        }
    };

    const handleStartEdit = (task) => {
        setEditingId(task._id);
        setEditTitle(task.title || "");
        setEditDescription(task.description || "");
    };

    const handleSaveEdit = async (_id) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:3001/api/tasks/${_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title: editTitle, description: editDescription }),
            });
            const data = await response.json();
            setTasks((prev) => prev.map((t) => (t._id === _id ? data.task : t)));
            setEditingId(null);
            setEditTitle("");
            setEditDescription("");
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
    };

    const handleDeleteTask = async (_id) => {
        try {
            const token = getToken();
            const response = await fetch(`http://localhost:3001/api/tasks/${_id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setTasks((prev) => prev.filter((task) => task._id !== _id));
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Mi Lista de Tareas</h1>
            <TaskForm
                taskTitle={taskTitle}
                setTaskTitle={setTaskTitle}
                taskDescription={taskDescription}
                setTaskDescription={setTaskDescription}
                onSubmit={handleAddTask}
            />
            <TaskTable
                tasks={tasks}
                editingId={editingId}
                editTitle={editTitle}
                editDescription={editDescription}
                setEditTitle={setEditTitle}
                setEditDescription={setEditDescription}
                onComplete={handleCompleteTask}
                onEdit={handleStartEdit}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                onDelete={handleDeleteTask}
            />
        </div>
    );
};

export default DashboardPage;