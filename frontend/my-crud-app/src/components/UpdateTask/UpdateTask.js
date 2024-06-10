import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateTask = () => {
    const { id } = useParams();
    const [task, setTask] = useState({
        title: "",
        description: "",
        status: "",
        dueDate: "",
        priority: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/tasks/${id}`)
            .then((response) => {
                setTask(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the task!", error);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prevTask) => ({ ...prevTask, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .put(`http://localhost:8080/api/tasks/${id}`, task)
            .then((response) => {
                alert("Task updated successfully!");
                navigate(`/task/${id}`);
            })
            .catch((error) => {
                console.error("There was an error updating the task!", error);
            });
    };

    return (
        <div className="container">
            <h2 className="my-4">Update Task</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter task title"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter task description"
                    />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select name="status" value={task.status} onChange={handleChange} className="form-control">
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
                        name="dueDate"
                        value={task.dueDate}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Priority:</label>
                    <select name="priority" value={task.priority} onChange={handleChange} className="form-control">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Update Task</button>
                <button type="button" onClick={() => navigate(`/task/${id}`)} className="btn btn-secondary ml-2">Cancel</button>
            </form>
        </div>
    );
};

export default UpdateTask;
