const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        "title": {
            type: String,
            required: true,
        },
        "description": {
            type: String,
            required: false,
        },
        "completed": {
            type: Boolean,
            default: false,
        },
        "dueDate": {
            type: Date,
            required: false,
        },
        "user": {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Task", TaskSchema);