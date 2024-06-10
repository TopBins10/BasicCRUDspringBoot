import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AddTask = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Not Started");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("Low");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const newTask = {
            title: title,
            description: description,
            status: status,
            dueDate: dueDate,
            priority: priority,
        };

        console.log("Submitting new task:", newTask);

        axios
            .post("http://localhost:8080/tasks", newTask)
            .then((response) => {
                console.log("Response from server:", response);
                setTitle("");
                setDescription("");
                setStatus("Not Started");
                setDueDate("");
                setPriority("Low");
                alert("Task added successfully!");
                navigate("/");
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    };

    return (
        <div className="container">
            <Link to="/" className="btn btn-secondary my-4">
                Home
            </Link>
            <h1>Add Task</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="form-control"
                        placeholder="Enter task title"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        className="form-control"
                        placeholder="Enter task description"
                    />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="form-control"
                    >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Parked">Parked</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Due Date:</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(event) => setDueDate(event.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Priority:</label>
                    <select
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                        className="form-control"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Task
                </button>
            </form>
        </div>
    );
};

export default AddTask;
