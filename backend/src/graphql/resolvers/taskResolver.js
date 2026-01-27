const Task = require('../../models/taskModel');

const { AuthenticationError, ForbiddenError, UserInputError } = require('apollo-server-express');

const taskResolver = {
    Query: {
        // Obtener todas las tareas del usuario autenticado
        tasks: async (_, __, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('No autorizado');
                }
                const userId = context.user.id;
                const tasks = await Task.find({ user: userId });
                return tasks;
            } catch (error) {
                throw new ForbiddenError(`Error al obtener tareas: ${error.message}`);
            }
        },

        // Obtener una tarea específica por ID
        task: async (_, { id }, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('No autorizado');
                }
                const task = await Task.findById(id);
                
                if (!task) {
                    throw new ForbiddenError('Tarea no encontrada');
                }

                // Verificar que la tarea pertenece al usuario autenticado
                if (task.user._id.toString() !== context.user.id) {
                    throw new AuthenticationError('No tienes permisos para acceder a esta tarea');
                }

                return task;
            } catch (error) {
                throw new ForbiddenError(`Error al obtener la tarea: ${error.message}`);
            }
        }
    },

    Mutation: {
        // Crear una nueva tarea
        createTask: async (_, { title, description, dueDate }, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('No autorizado');
                }

                if (!title || title.trim() === '') {
                    throw new UserInputError('El título de la tarea es requerido');
                }

                const newTask = new Task({
                    title,
                    description,
                    dueDate: dueDate ? new Date(dueDate) : new Date(),
                    user: context.user.id
                });

                const savedTask = await newTask.save();
                return savedTask;
            } catch (error) {
                throw new ForbiddenError(`Error al crear la tarea: ${error.message}`);
            }
        },

        // Actualizar una tarea
        updateTask: async (_, { id, title, description, dueDate, completed }, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('No autorizado');
                }

                if (title && title.trim() === '') {
                    throw new UserInputError('El título de la tarea es requerido');
                }

                // Verificar que la tarea pertenece al usuario
                const task = await Task.findById(id);
                if (!task) {
                    throw new ForbiddenError('Tarea no encontrada');
                }

                if (task.user.toString() !== context.user.id) {
                    throw new AuthenticationError('No tienes permisos para actualizar esta tarea');
                }

                const updateData = {};
                if (title) updateData.title = title;
                if (description !== undefined) updateData.description = description;
                if (dueDate) updateData.dueDate = new Date(dueDate);
                if (completed !== undefined) updateData.completed = completed;

                const updatedTask = await Task.findByIdAndUpdate(
                    id,
                    updateData,
                    { new: true }
                );

                return updatedTask;
            } catch (error) {
                throw new ForbiddenError(`Error al actualizar la tarea: ${error.message}`);
            }
        },

        // Eliminar una tarea
        deleteTask: async (_, { id }, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('No autorizado');
                }

                const task = await Task.findById(id);
                if (!task) {
                    throw new ForbiddenError('Tarea no encontrada');
                }

                if (task.user.toString() !== context.user.id) {
                    throw new AuthenticationError('No tienes permisos para eliminar esta tarea');
                }

                await Task.findByIdAndDelete(id);
                return true;
            } catch (error) {
                throw new ForbiddenError(`Error al eliminar la tarea: ${error.message}`);
            }
        }
    }
};

module.exports = taskResolver;
