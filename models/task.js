

const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    desc: {
        type: String,
        required: true
    },
    important: {
        type: Boolean,
        default: false, 
    },
    complete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
