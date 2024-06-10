import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/tasks')
            .then(response => {
                const sortedTasks = response.data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                setTasks(sortedTasks.slice(0, 5));
            })
            .catch(error => {
                console.error("There was an error fetching the tasks!", error);
            });
    }, []);

    return (
        <div className="container">
            <h1 className="my-4">Dashboard</h1>
            <Link to="/add-task" className="btn btn-primary mb-3">Add Task</Link>
            <Link to="/list-tasks" className="btn btn-secondary mb-3 ml-2">View All Tasks</Link>
            <h3>Deadline Approaching</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Task Name</th>
                        <th>Due Date</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
