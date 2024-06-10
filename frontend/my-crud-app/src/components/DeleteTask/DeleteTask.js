import React from "react";
import axios from "axios";

const DeleteTask = ({ taskId, onDelete }) => {
    const handleDelete = () => {
        axios
            .delete(`http://localhost:8080/api/tasks/${taskId}`)
            .then((response) => {
                if (onDelete) {
                    onDelete(taskId);
                }
            })
            .catch((error) => {
                console.error("There was an error deleting the task!", error);
            });
    };

    return (
        <button onClick={handleDelete} className="btn btn-danger btn-sm ml-2">
            Delete
        </button>
    );
};

export default DeleteTask;
