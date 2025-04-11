import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

// Login/Register Component
const LoginRegister: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const endpoint = isRegistering
      ? 'http://localhost:3001/api/users/register'
      : 'http://localhost:3001/api/users/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        navigate('/tasks');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>{isRegistering ? 'Register' : 'Login'}</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit} className="btn primary">
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <button onClick={() => setIsRegistering(!isRegistering)} className="btn secondary">
          Switch to {isRegistering ? 'Login' : 'Register'}
        </button>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

// Task Manager Component
const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState<string>('');

  const addTask = () => {
    if (input.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInput('');
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="container">
      <div className="card tasks">
        <h1>Checklist App</h1>
        <div className="input-group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new task..."
          />
          <button onClick={addTask} className="btn add">
            Add
          </button>
        </div>
        <ul className="checklist">
          {tasks.map((task) => (
            <li key={task.id} className={`checklist-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-item">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.text}
              </span>
            </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Main App Component with Dark Mode Toggle
const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <Router>
      {/* Conditionally add the "dark" class based on darkMode state */}
      <div className={darkMode ? 'dark' : ''}>
        {/* Dark Mode Toggle Button, fixed in the upper right corner */}
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
          <button onClick={toggleDarkMode} className="btn secondary">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/tasks" element={<TaskManager />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
