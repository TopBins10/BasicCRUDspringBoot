import React, { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

// The AddTask component allows users to add new tasks through a form
const AddTask = () => {
    // Using the useState hook to manage state for each field in the task form
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("");

    // This function is called when the form is submitted
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Creating a new task object from the state values
        const newTask = {
            title: title,
            description: description,
            status: status,
            dueDate: dueDate,
            priority: priority,
        };

        // Using axios to send a POST request to the server with the new task data
        axios
            .post("http://localhost:8080/tasks", newTask)
            .then((response) => {
                console.log(response); // Logging the response from the server

                // Clearing the form fields after a successful submission
                setTitle("");
                setDescription("");
                setStatus("");
                setDueDate("");
                setPriority("");

                // Providing feedback to the user
                alert("Task added successfully!");
            })
            .catch((error) => {
                // Logging any errors to the console
                console.error("There was an error!", error);
            });
    };

    return (
        <div>
            <Link to="/">
                <button>Home</button>
            </Link>
            <h1>Add Task</h1>
            {/* Form for adding a new task */}
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    {/* Input field for task title */}
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
                    {/* Input field for task description */}
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
                    {/* Input field for task status */}
                    <input
                        type="text"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        placeholder="Enter task status"
                        required
                    />
                </label>
                <br />
                <label>
                    Due Date:
                    {/* Input field for task due date */}
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
                    {/* Input field for task priority */}
                    <input
                        type="text"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                        placeholder="Enter task priority"
                        required
                    />
                </label>
                <br />
                {/* Submit button to add the task */}
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default AddTask;
