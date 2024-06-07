import React, { useState, useEffect } from "react";
import axios from "axios";

// UpdateTask component: Handles updating an existing task
const UpdateTask = ({ task, onUpdate }) => {
    // Initialize state variables for each task field
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [status, setStatus] = useState(task.status);
    const [dueDate, setDueDate] = useState(task.dueDate);
    const [priority, setPriority] = useState(task.priority);

    // useEffect hook: Updates state variables when the task prop changes
    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setDueDate(task.dueDate);
        setPriority(task.priority);
    }, [task]);

    // handleSubmit function: Handles form submission for updating the task
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        // Create an updatedTask object with the current state values
        const updatedTask = { ...task, title, description, status, dueDate, priority };
        
        // Send a PUT request to update the task in the backend
        axios
            .put(`http://localhost:8080/tasks/${task.id}`, updatedTask)
            .then((response) => {
                console.log("Task updated:", response.data);
                // Call the onUpdate callback to update the parent component state
                if (onUpdate) {
                    onUpdate(response.data);
                }
            })
            .catch((error) => {
                console.error("There was an error updating the task!", error);
            });
    };

    // Render the form for updating the task
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter task title"
                    required
                />
            </label>
            <br />
            <label>
                Description:
                <input
                    type="text"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Enter task description"
                />
            </label>
            <br />
            <label>
                Status:
                <input
                    type="text"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    placeholder="Enter task status"
                />
            </label>
            <br />
            <label>
                Due Date:
                <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    placeholder="Enter task due date"
                />
            </label>
            <br />
            <label>
                Priority:
                <input
                    type="text"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                    placeholder="Enter task priority"
                />
            </label>
            <br />
            <button type="submit">Update Task</button>
        </form>
    );
};

export default UpdateTask;
