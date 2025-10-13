const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage for request logs (keeping for demo purposes)
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
  getAllTasks((err, tasks) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tasks);
  });
});

// GET /api/tasks/:id - Retrieve a single task
app.get('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  logRequest('GET', `/api/tasks/${id}`);
  getTaskById(id, (err, task) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  });
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, completed = false } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = {
    title,
    description: description || '',
    completed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  createTask(newTask, (err, task) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    logRequest('POST', '/api/tasks', task);
    res.status(201).json(task);
  });
});

// PUT /api/tasks/:id - Update a task
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, completed } = req.body;
  getTaskById(id, (err, task) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const updatedTask = {
      title: title !== undefined ? title : task.title,
      description: description !== undefined ? description : task.description,
      completed: completed !== undefined ? completed : task.completed,
      updatedAt: new Date().toISOString()
    };
    updateTask(id, updatedTask, (err, updated) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      logRequest('PUT', `/api/tasks/${id}`, updated);
      res.json(updated);
    });
  });
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  deleteTask(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    logRequest('DELETE', `/api/tasks/${id}`, result);
    res.json(result);
  });
});

// GET /api/logs - Retrieve request logs
app.get('/api/logs', (req, res) => {
  res.json(requestLog);
});

// GET /api/stats - Get task statistics
app.get('/api/stats', (req, res) => {
  getAllTasks((err, tasks) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    res.json({ total, completed, pending });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});