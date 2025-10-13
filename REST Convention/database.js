const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      createdAt TEXT,
      updatedAt TEXT
    )`);
  }
});

// Helper functions
function getAllTasks(callback) {
  db.all('SELECT * FROM tasks', [], callback);
}

function getTaskById(id, callback) {
  db.get('SELECT * FROM tasks WHERE id = ?', [id], callback);
}

function createTask(task, callback) {
  const { title, description, completed = false, createdAt, updatedAt } = task;
  db.run('INSERT INTO tasks (title, description, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
    [title, description, completed, createdAt, updatedAt], function(err) {
      if (err) {
        callback(err);
      } else {
        getTaskById(this.lastID, callback);
      }
    });
}

function updateTask(id, updates, callback) {
  const { title, description, completed, updatedAt } = updates;
  db.run('UPDATE tasks SET title = ?, description = ?, completed = ?, updatedAt = ? WHERE id = ?',
    [title, description, completed, updatedAt, id], function(err) {
      if (err) {
        callback(err);
      } else if (this.changes === 0) {
        callback(new Error('Task not found'));
      } else {
        getTaskById(id, callback);
      }
    });
}

function deleteTask(id, callback) {
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { id });
    }
  });
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };