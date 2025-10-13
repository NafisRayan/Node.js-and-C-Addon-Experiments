const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage for tasks
let tasks = [];
let taskIdCounter = 1;
let requestLog = [];

// Helper function to log requests
function logRequest(method, endpoint, data = null) {
  const logEntry = {
    id: requestLog.length + 1,
    timestamp: new Date().toISOString(),
    method,
    endpoint,
    data
  };
  requestLog.push(logEntry);
  // Keep only last 50 logs
  if (requestLog.length > 50) {
    requestLog.shift();
  }
}

// Routes

// GET /api/tasks - Retrieve all tasks
app.get('/api/tasks', (req, res) => {
  logRequest('GET', '/api/tasks');
  res.json(tasks);
});

// GET /api/tasks/:id - Retrieve a single task
app.get('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  logRequest('GET', `/api/tasks/${id}`);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, completed = false } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = {
    id: taskIdCounter++,
    title,
    description: description || '',
    completed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(newTask);
  logRequest('POST', '/api/tasks', newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update a task
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, completed } = req.body;
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const updatedTask = {
    ...tasks[taskIndex],
    title: title !== undefined ? title : tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed,
    updatedAt: new Date().toISOString()
  };
  tasks[taskIndex] = updatedTask;
  logRequest('PUT', `/api/tasks/${id}`, updatedTask);
  res.json(updatedTask);
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  logRequest('DELETE', `/api/tasks/${id}`, deletedTask);
  res.json(deletedTask);
});

// GET /api/logs - Retrieve request logs
app.get('/api/logs', (req, res) => {
  res.json(requestLog);
});

// GET /api/stats - Get task statistics
app.get('/api/stats', (req, res) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  res.json({ total, completed, pending });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});