import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

const TaskDetails = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/tasks/${id}`)
            .then(response => {
                setTask(response.data);
                setLoading(false);
                console.log(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the task!", error);
                setLoading(false);
            });
    }, [id]);

    const handleDelete = () => {
        axios.delete(`http://localhost:8080/tasks/${id}`)
            .then(() => {
                alert('Task deleted successfully!');
                navigate('/');
            })
            .catch(error => {
                console.error("There was an error deleting the task!", error);
            });
    };

    if (loading) {
        return <div>Loading task details...</div>;
    }

    return (
        <div className="container">
            <h2 className="my-4">Task Details</h2>
            <p><strong>Title:</strong> {task.title}</p>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Due Date:</strong> {task.dueDate}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <Link to={`/update-task/${task.id}`} className="btn btn-primary">Update Task</Link>
            <button onClick={handleDelete} className="btn btn-danger ml-2">Delete Task</button>
            <Link to="/list-tasks" className="btn btn-secondary ml-2">Back to List</Link>
        </div>
    );
};

export default TaskDetails;
