import React, { use, useEffect, useState } from "react";
import TaskTable from "../components/tasks/taskTable";
import TaskForm from "../components/tasks/TaskForm";

import { GET_TASKS_QUERY } from "../graphql/task/taskQuery";
import { CREATE_TASK_MUTATION } from "../graphql/task/taskMutation";
import { COMPLETE_TASK_MUTATION } from "../graphql/task/taskMutation";
import { DELETE_TASK_MUTATION } from "../graphql/task/taskMutation";
import { UPDATE_TASK_MUTATION } from "../graphql/task/taskMutation";
import { useMutation } from "@apollo/client";
import { useLazyQuery } from "@apollo/client";

const DashboardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [title, setTaskTitle] = useState("");
    const [description, setTaskDescription] = useState("");
    const [dueDate] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    
    const [loadTasks, { data }] = useLazyQuery(GET_TASKS_QUERY);
    const [completeTask] = useMutation(COMPLETE_TASK_MUTATION);
    const [deleteTask] = useMutation(DELETE_TASK_MUTATION, {
        refetchQueries: [{ query: GET_TASKS_QUERY }],
        awaitRefetchQueries: true,
    });
    const [updateTask] = useMutation(UPDATE_TASK_MUTATION, {
        refetchQueries: [{ query: GET_TASKS_QUERY }],
        awaitRefetchQueries: true,
        onError: (error)=> {
            alert(error.message)
        }
    });

    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        loadTasks({
            context: {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            },
        });
    }, []);

    useEffect(() => {
        if (data && data.tasks) {
            console.log("Fetched tasks:", data.tasks); // Aquí 'tasks', no 'getTasks'
            setTasks(data.tasks);
        }
    }, [data]);

    const [createTask] = useMutation(CREATE_TASK_MUTATION, {
        refetchQueries: [{ query: GET_TASKS_QUERY }],
        awaitRefetchQueries: true,
    });

    const handleAddTask = async (e) => {
        e.preventDefault();

        if (!title) return alert("El título es obligatorio");
        try {
            
            await createTask({
                variables: { title, description, dueDate },
            });
            setTaskTitle("");
            setTaskDescription("");
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Error al crear la tarea");
        }
    };

    const handleCompleteTask = async (_id) => {
        try {
            await completeTask({
                variables: { id: _id },
            });
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
            await updateTask({
                variables: {
                    id: _id,
                    title: editTitle,
                    description: editDescription,
                },
            });
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
            await deleteTask({
                variables: { id: _id },
            });
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Mi Lista de Tareas</h1>
            <TaskForm
                taskTitle={title}
                setTaskTitle={setTaskTitle}
                taskDescription={description}
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