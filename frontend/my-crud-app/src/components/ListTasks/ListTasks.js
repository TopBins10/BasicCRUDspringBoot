import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DeleteTask from '../DeleteTask';
import UpdateTask from '../UpdateTask';

const ListTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Component mounted. Fetching tasks...");
        fetchTasks(); // Call fetchTasks function to get tasks from the backend.
    }, []); // Empty dependency array ensures this runs only once on mount.

    const fetchTasks = () => {
        axios.get('http://localhost:8080/tasks')
            .then(response => {
                console.log("Tasks fetched successfully:", response.data);
                setTasks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the tasks!", error);
                setLoading(false);
            });
    };

    const handleTaskDelete = (deletedTaskId) => {
        setTasks(tasks.filter(task => task.id !== deletedTaskId));
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    };

    if (loading) {
        return <div>Loading tasks...</div>;
    }

    return (
        <div>
            <h1>Tasks</h1>
            <Link to="/add-task">
                <button>Add Task</button>
            </Link>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        <div>
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                            <p>Status: {task.status}</p>
                            <p>Due Date: {task.dueDate}</p>
                            <p>Priority: {task.priority}</p>
                            <DeleteTask taskId={task.id} onDelete={handleTaskDelete} />
                            <UpdateTask task={task} onUpdate={handleTaskUpdate} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListTasks;
