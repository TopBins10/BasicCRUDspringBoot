import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListTasks from './components/ListTasks';
import AddTask from './components/AddTask';
import UpdateTask from './components/UpdateTask';

function App() {
  return (
    <Router>
      <div>
        <h1>Task Manager</h1>
        <Routes>
          <Route path="/" element={<ListTasks />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/update-task/:id" element={<UpdateTask />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
