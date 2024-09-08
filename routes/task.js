const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const { authenticateToken } = require("./auth");

// create-task
router.post("/create-task", authenticateToken, async (req, res) => {
    try {
        const { title, desc } = req.body;
        const userId = req.user.id;  // Get user ID from authenticated user

        if (!title || !desc) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Create and save new task
        const newTask = new Task({ title, desc });
        const savedTask = await newTask.save();

        // Update user with new task reference 
        await User.findByIdAndUpdate(userId, { $push: { tasks: savedTask._id } });

        res.status(200).json({ message: "Task Created", taskId: savedTask._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// get all tasks
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; 
        const userData = await User.findById(userId).populate({
            path: "tasks",
            options: { sort: { createdAt: -1 }},
        });
        res.status(200).json({ data: userData.tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// delete task
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params; 
        const userId = req.user.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// update task
router.put("/update-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params; 
        const { title, desc } = req.body;
        await Task.findByIdAndUpdate(id, { title, desc });
        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// update important task
router.put("/update-imp-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params; 
        const taskData = await Task.findById(id);
        const isImportant = taskData.important;
        await Task.findByIdAndUpdate(id, { important: !isImportant });
        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// update complete task
router.put("/update-complete-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params; 
        const taskData = await Task.findById(id);
        const isComplete = taskData.complete;
        await Task.findByIdAndUpdate(id, { complete: !isComplete });
        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// get important tasks
router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; 
        const userData = await User.findById(userId).populate({
            path: "tasks",
            match: { important: true },
            options: { sort: { createdAt: -1 } }
        });
        res.status(200).json({ data: userData.tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// get complete tasks
router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; 
        const userData = await User.findById(userId).populate({
            path: "tasks",
            match: { complete: true },
            options: { sort: { createdAt: -1 } }
        });
        res.status(200).json({ data: userData.tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// get incomplete tasks
router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; 
        const userData = await User.findById(userId).populate({
            path: "tasks",
            match: { complete: false },
            options: { sort: { createdAt: -1 } }
        });
        res.status(200).json({ data: userData.tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
