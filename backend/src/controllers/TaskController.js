
const Task = require('../models/taskModel');

const validateTaskInput = (req) => {
    if (!req.body.title || req.body.title.trim() === '') {
        return {
            isValid: false,
            message: "El título de la tarea es requerido"
        };
    }
    return {
        isValid: true,
        message: "Validación exitosa"
    };
}

const getAllTasks = async(req, res) => {
    try{
        const userId = req.user.id; // Obtener el id del usuario autenticado
        const tasks = await Task.find({ user: userId });
        console.log(tasks);
        res.json({
            success: true,
            tasks: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las tareas",
            error: error.message
        });
    }
}

const createTask = async(req, res) => {
    try {
        const validation = validateTaskInput(req);
        
        if(!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }
        
        const { title, description, dueDate } = req.body;
        const userId = req.user.id; // Obtener el id del usuario del middleware auth
        
        const newTask = new Task({
            title,
            description,
            dueDate: dueDate || new Date(),
            user: userId // Asignar el usuario a la tarea
        });
        const savedTask = await newTask.save();
        // Populate para obtener los datos del usuario
        const populatedTask = await savedTask.populate('user', 'name email');
        
        res.status(201).json({
            success: true,
            task: populatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear la tarea",
            error: error.message
        });
    }
}

const deleteTask = async(req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: "Tarea no encontrada"
            });
        }
        res.json({
            success: true,
            message: "Tarea eliminada exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la tarea",
            error: error.message
        });
    }
}

const updateTask = async(req, res) => {
    const validation = validateTaskInput(req);
    if(!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: validation.message
        });
    }
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        if(!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Tarea no encontrada"
            });
        }
        res.json({
            success: true,
            task: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la tarea",
            error: error.message
        });
    }
}

const markTaskCompleted = async(req, res) => {
    try {
        const { id } = req.params;

        // Si el cliente envía { completed: true/false } lo usamos, sino alternamos
        let completedValue;
        if (typeof req.body.completed === 'boolean') {
            completedValue = req.body.completed;
        } else {
            // obtener la tarea actual para alternar
            const existing = await Task.findById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
            }
            completedValue = !existing.completed;
        }

        const updated = await Task.findByIdAndUpdate(id,
            { $set: { completed: completedValue } },
            { new: true }
        );

        if(!updated) {
            return res.status(404).json({
                success: false,
                message: "Tarea no encontrada"
            });
        }

        res.json({ success: true, task: updated });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al marcar la tarea como completada",
            error: error.message
        });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    deleteTask,
    updateTask,
    markTaskCompleted
};