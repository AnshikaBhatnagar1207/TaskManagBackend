const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");

// Middleware
app.use(cors());
app.use(express.json());
const mongoose = require("mongoose");

const USER_NAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;
const DB_NAME = process.env.DB_NAME;

const MONGO_URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.idcn0.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const response = mongoose.connect(MONGO_URI)
.then((data)=>{
    console.log("Database has been connected successfully");
})
.catch((err)=>{
    console.log(err.message);
})

// API routes 
app.use("/api/v1", UserAPI);   // e.g., localhost:1000/api/v1/sign-in 
app.use("/api/v2", TaskAPI);   // e.g., localhost:1000/api/v2/create-task

// Default route
app.get("/", (req, res) => {
    res.send("Hello from backend");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Server setup
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

