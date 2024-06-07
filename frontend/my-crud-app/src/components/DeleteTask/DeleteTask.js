import React from "react";
import axios from "axios";

/**
 * DeleteTask Component
 * 
 * This component renders a button that deletes a task when clicked.
 * It uses the axios library to send a DELETE request to the backend server.
 * 
 * Props:
 * - taskId: The ID of the task to be deleted.
 * - onDelete: A callback function to notify the parent component after the task is deleted.
 */

const DeleteTask = ({ taskId, onDelete }) => {
    
    // Function to handle the delete button click
    const handleDelete = () => {
        // Sending a DELETE request to the backend server to delete the task
        axios
            .delete(`http://localhost:8080/tasks/${taskId}`)
            .then((response) => {
                console.log("Task deleted:", response.data);
                // If an onDelete callback is provided, call it to update the parent component state
                if (onDelete) {
                    onDelete(taskId);  // Notify the parent component that the task has been deleted
                }
            })
            .catch((error) => {
                console.error("There was an error deleting the task!", error);
            });
    };

    // Render a delete button
    return <button onClick={handleDelete}>Delete</button>;
};

export default DeleteTask;
