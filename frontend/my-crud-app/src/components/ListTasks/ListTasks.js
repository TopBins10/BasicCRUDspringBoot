import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        axios.get('http://localhost:8080/tasks')
            .then(response => {
                setTasks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the tasks!", error);
                setLoading(false);
            });
    };

    if (loading) {
        return <div>Loading tasks...</div>;
    }

    return (
        <div className="container">
            <h1 className="my-4">All Tasks</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Task Name</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>
                                <Link to={`/task/${task.id}`}>
                                    {task.title}
                                </Link>
                            </td>
                            <td>{task.dueDate}</td>
                            <td>
                                <Link to={`/task/${task.id}`} className="btn btn-info btn-sm">
                                    View Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/" className="btn btn-secondary my-4">
                Home
            </Link>
        </div>
    );
};

export default ListTasks;
