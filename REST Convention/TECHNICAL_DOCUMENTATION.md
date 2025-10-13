# Technical Documentation: REST Task Tracker with SQLite

## Overview

The REST Task Tracker is a full-stack web application that demonstrates REST API concepts through an interactive task management system. It features a modern web interface for managing tasks and a robust backend API with persistent SQLite storage.

**Key Features:**
- Complete CRUD operations for tasks
- RESTful API design
- Persistent data storage with SQLite
- Real-time UI updates
- Request logging and statistics
- Responsive design with Tailwind CSS

**Technology Stack:**
- **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript, Chart.js
- **Backend:** Node.js, Express.js, SQLite3
- **Database:** SQLite 3
- **Development:** npm, nodemon

## Architecture

The application follows a client-server architecture with clear separation of concerns:

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Frontend      │◄────────────────►│   Backend API   │
│   (Browser)     │                  │   (Node.js)     │
└─────────────────┘                  └─────────────────┘
                                           │
                                           ▼
                                   ┌─────────────────┐
                                   │   Database      │
                                   │   (SQLite)      │
                                   └─────────────────┘
```

### Component Responsibilities

- **Frontend:** Handles user interaction, renders UI, makes API calls
- **Backend:** Processes HTTP requests, business logic, data persistence
- **Database:** Stores task data persistently

## Frontend Components

### File Structure
```
public/
├── index.html     # Main HTML structure and UI layout
└── app.js         # Frontend JavaScript logic
```

### index.html

**Purpose:** Provides the complete user interface structure and styling.

**Key Sections:**
- **Header:** Displays app title, total/completed task counts
- **Task Grid:** Container for displaying task cards
- **Action Bar:** "Add Task" button
- **Statistics Chart:** Doughnut chart showing completion stats
- **Request Log:** Displays API request history
- **Modals:** Forms for adding, editing, and deleting tasks

**Technologies Used:**
- **Tailwind CSS:** Utility-first CSS framework for styling
- **Chart.js:** Library for rendering statistics charts
- **Heroicons:** Icon library for UI elements
- **Custom CSS:** Additional animations and modal styling

**Responsive Design:**
- Mobile-first approach with breakpoint-specific layouts
- Grid system adapts from 1 column (mobile) to 3 columns (desktop)
- Modal dialogs are centered and responsive

### app.js

**Purpose:** Handles all frontend logic, API communication, and DOM manipulation.

**Key Functions:**

#### Initialization
```javascript
async function init() {
  await loadTasks();
  await loadLogs();
  await loadStats();
  setupEventListeners();
}
```
- Loads initial data and sets up event handlers on page load

#### API Communication
```javascript
async function apiRequest(method, endpoint, data = null) {
  const config = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (data) config.body = JSON.stringify(data);
  const response = await fetch(`${API_BASE}${endpoint}`, config);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}
```
- Centralized function for all API calls
- Handles JSON serialization/deserialization
- Throws errors for non-2xx responses

#### Data Loading Functions
- `loadTasks()`: Fetches and renders all tasks
- `loadLogs()`: Retrieves and displays API request history
- `loadStats()`: Gets statistics and updates chart

#### Task Management
- `renderTasks(tasks)`: Creates and displays task cards
- `createTaskElement(task)`: Generates HTML for individual task
- `handleTaskSubmit()`: Processes new task creation
- `handleEditSubmit()`: Updates existing tasks
- `handleDeleteConfirm()`: Removes tasks
- `toggleTask(id)`: Toggles completion status

#### UI Components
- Modal management (open/close handlers)
- Form validation and submission
- Dynamic statistics chart updates
- Request log display with method badges

#### Event Handling
- Delegated event listeners for task actions
- Keyboard navigation (Escape key closes modals)
- Form submissions with preventDefault
- Click-outside-to-close for modals

## Backend Components

### File Structure
```
├── server.js          # Main Express server and API routes
├── database.js        # SQLite database operations
├── package.json       # Dependencies and scripts
└── public/            # Static frontend files
```

### server.js

**Purpose:** Express.js server that handles HTTP requests and coordinates between frontend and database.

**Key Components:**

#### Server Setup
```javascript
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
```
- Imports required modules including database functions
- Sets up Express app with middleware
- Enables CORS for frontend communication
- Serves static files from public directory

#### Request Logging
```javascript
function logRequest(method, endpoint, data = null) {
  const logEntry = {
    id: requestLog.length + 1,
    timestamp: new Date().toISOString(),
    method,
    endpoint,
    data
  };
  requestLog.push(logEntry);
  if (requestLog.length > 50) requestLog.shift();
}
```
- Tracks all API requests for demonstration
- Maintains last 50 requests in memory
- Includes timestamp, method, endpoint, and optional data

#### API Routes

**GET /api/tasks**
- Retrieves all tasks from database
- Logs the request
- Returns JSON array of tasks

**GET /api/tasks/:id**
- Retrieves single task by ID
- Validates task existence
- Returns 404 if not found

**POST /api/tasks**
- Creates new task with validation
- Generates timestamps
- Returns created task with database-generated ID

**PUT /api/tasks/:id**
- Updates existing task (full or partial)
- Merges provided fields with existing data
- Returns updated task or 404

**DELETE /api/tasks/:id**
- Removes task from database
- Returns deleted task data

**GET /api/logs**
- Returns request log history
- Used by frontend for display

**GET /api/stats**
- Calculates task statistics
- Returns total, completed, and pending counts

#### Error Handling
- Database errors return 500 status
- Validation errors return 400 status
- Not found errors return 404 status
- All errors include descriptive messages

### database.js

**Purpose:** Handles all SQLite database operations with callback-based API.

**Database Initialization:**
```javascript
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
```
- Opens database connection
- Creates tasks table if it doesn't exist
- Logs connection status

**CRUD Functions:**

#### getAllTasks(callback)
- Executes `SELECT * FROM tasks`
- Returns array of all tasks

#### getTaskById(id, callback)
- Executes `SELECT * FROM tasks WHERE id = ?`
- Returns single task or null

#### createTask(task, callback)
- Inserts new task with parameterized query
- Returns created task with generated ID
- Uses lastID from SQLite

#### updateTask(id, updates, callback)
- Updates task fields dynamically
- Checks changes count for existence validation
- Returns updated task

#### deleteTask(id, callback)
- Deletes task by ID
- Returns success confirmation

**Error Handling:**
- All functions pass errors to callbacks
- Database errors are propagated up
- Validation for task existence in updates/deletes

## Database Schema

### Tasks Table

| Column     | Type    | Constraints          | Description              |
|------------|---------|----------------------|--------------------------|
| id         | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique task identifier   |
| title      | TEXT    | NOT NULL             | Task title               |
| description| TEXT    | NULL                 | Optional task description|
| completed  | BOOLEAN | DEFAULT FALSE        | Completion status        |
| createdAt  | TEXT    | NOT NULL             | ISO timestamp            |
| updatedAt  | TEXT    | NOT NULL             | ISO timestamp            |

**Indexes:** Primary key on `id` (automatic)

**Relationships:** None (single table design)

## Data Flow

### Task Creation Flow
1. User clicks "Add Task" → opens modal
2. User fills form and submits
3. Frontend validates and sends POST /api/tasks
4. Backend validates title requirement
5. Database insert operation
6. Backend returns created task with ID
7. Frontend updates UI and refreshes data

### Task Retrieval Flow
1. Page loads or data refresh triggered
2. Frontend calls GET /api/tasks
3. Backend queries database for all tasks
4. Database returns task array
5. Backend sends JSON response
6. Frontend renders task cards

### Task Update Flow
1. User clicks edit or toggle on task
2. Frontend sends PUT /api/tasks/:id
3. Backend fetches current task data
4. Merges updates with existing data
5. Database update operation
6. Returns updated task
7. Frontend refreshes display

## API Reference

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### GET /tasks
**Description:** Retrieve all tasks

**Response:**
```json
[
  {
    "id": 1,
    "title": "Sample Task",
    "description": "Task description",
    "completed": false,
    "createdAt": "2025-10-13T10:00:00.000Z",
    "updatedAt": "2025-10-13T10:00:00.000Z"
  }
]
```

#### GET /tasks/:id
**Description:** Retrieve single task

**Parameters:**
- `id` (integer): Task ID

**Response:** Single task object or 404

#### POST /tasks
**Description:** Create new task

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Optional description",
  "completed": false
}
```

**Response:** Created task object with ID

#### PUT /tasks/:id
**Description:** Update existing task

**Parameters:**
- `id` (integer): Task ID

**Request Body:** Partial task object (any fields)

**Response:** Updated task object or 404

#### DELETE /tasks/:id
**Description:** Delete task

**Parameters:**
- `id` (integer): Task ID

**Response:** Deleted task object or 404

#### GET /logs
**Description:** Get request logs

**Response:** Array of log entries

#### GET /stats
**Description:** Get task statistics

**Response:**
```json
{
  "total": 5,
  "completed": 2,
  "pending": 3
}
```

# API Integration Details

## Overview

The frontend communicates with the backend through a RESTful API using the Fetch API. All API calls are centralized through the `apiRequest()` function, which handles HTTP requests, JSON serialization, and error handling.

## Core API Function

### `apiRequest(method, endpoint, data = null)`

**Purpose:** Centralized HTTP request handler for all API communications.

**Implementation:**
```javascript
async function apiRequest(method, endpoint, data = null) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (data) {
    config.body = JSON.stringify(data);
  }
  const response = await fetch(`${API_BASE}${endpoint}`, config);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
```

**Features:**
- Automatic JSON content-type header
- JSON serialization for request bodies
- Error throwing for non-2xx responses
- Consistent base URL handling (`http://localhost:3000/api`)

## API Endpoint Integrations

### 1. GET /api/tasks - Load All Tasks

**Frontend Function:** `loadTasks()`

**Purpose:** Fetches all tasks from the database and renders them in the UI.

**Code Flow:**
```javascript
async function loadTasks() {
  try {
    const tasks = await apiRequest('GET', '/tasks');  // API call
    renderTasks(tasks);                               // Render UI
    updateHeaderStats(tasks);                         // Update counters
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}
```
**Integration Points:**
- Called on app initialization
- Called after every task creation, update, or deletion
- Updates task grid, empty state, and header statistics
- Triggers re-render of entire task list

**Error Handling:** Logs errors to console, doesn't show user alerts (graceful degradation)

---

### 2. POST /api/tasks - Create New Task

**Frontend Function:** `handleTaskSubmit(e)`

**Purpose:** Creates a new task when the add task form is submitted.

**Code Flow:**
```javascript
async function handleTaskSubmit(e) {
  e.preventDefault();
  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();

  if (!title) return;  // Client-side validation

  try {
    await apiRequest('POST', '/tasks', { title, description });  // API call
    closeAddModalHandler();                                       // Close modal
    await loadTasks();                                            // Refresh tasks
    await loadLogs();                                             // Refresh logs
    await loadStats();                                            // Refresh stats
  } catch (error) {
    console.error('Error creating task:', error);
    alert('Error creating task. Please try again.');             // User feedback
  }
}
```
**Integration Points:**
- Triggered by form submission event
- Validates required fields client-side
- Closes modal on success
- Refreshes all data views (tasks, logs, stats)
- Shows user alert on failure

**Request Payload:**
```json
{
  "title": "Task Title",
  "description": "Optional description"
}
```

---

### 3. GET /api/tasks/:id - Fetch Single Task

**Frontend Usage:** Multiple functions for editing and toggling

**Purpose:** Retrieves a specific task for editing or status updates.

**Code Examples:**

**For Editing:**
```javascript
// In delegated event listener
if (editBtn) {
  const id = editBtn.getAttribute('data-id');
  apiRequest('GET', `/tasks/${id}`)
    .then(task => openEditModal(task))
    .catch(error => console.error('Error fetching task:', error));
}
```

**For Toggling:**
```javascript
async function toggleTask(id) {
  try {
    const task = await apiRequest('GET', `/tasks/${id}`);  // Fetch current state
    await apiRequest('PUT', `/tasks/${id}`, { completed: !task.completed });  // Update
    await loadTasks();
    await loadLogs();
    await loadStats();
  } catch (error) {
    console.error('Error toggling task:', error);
  }
}
```
**Integration Points:**
- Used in edit button clicks to populate edit modal
- Used in toggle operations to get current completion status
- Critical for optimistic updates (get current → modify → send update)

---

### 4. PUT /api/tasks/:id - Update Task

**Frontend Functions:** `handleEditSubmit(e)` and `toggleTask(id)`

**Purpose:** Updates existing task data (full edit or completion toggle).

**Code Flows:**

**Edit Form Submission:**
```javascript
async function handleEditSubmit(e) {
  e.preventDefault();
  const title = editTaskTitle.value.trim();
  const description = editTaskDescription.value.trim();

  if (!title || !currentEditId) return;

  try {
    await apiRequest('PUT', `/tasks/${currentEditId}`, { title, description });
    closeEditModalHandler();
    await loadTasks();
    await loadLogs();
    await loadStats();
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Error updating task. Please try again.');
  }
}
```

**Toggle Completion:**
```javascript
async function toggleTask(id) {
  try {
    const task = await apiRequest('GET', `/tasks/${id}`);
    await apiRequest('PUT', `/tasks/${id}`, { completed: !task.completed });
    await loadTasks();
    await loadLogs();
    await loadStats();
  } catch (error) {
    console.error('Error toggling task:', error);
  }
}
```
**Integration Points:**
- Edit modal form submission
- Task completion toggle buttons
- Supports partial updates (only changed fields sent)
- Refreshes all views after successful update

**Request Payload Examples:**
```json
// Edit operation
{
  "title": "Updated Title",
  "description": "Updated description"
}

// Toggle operation
{
  "completed": true
}
```

---

### 5. DELETE /api/tasks/:id - Delete Task

**Frontend Function:** `handleDeleteConfirm()`

**Purpose:** Permanently removes a task from the system.

**Code Flow:**
```javascript
async function handleDeleteConfirm() {
  if (!currentDeleteId) return;

  try {
    await apiRequest('DELETE', `/tasks/${currentDeleteId}`);
    closeDeleteModal();
    await loadTasks();
    await loadLogs();
    await loadStats();
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Error deleting task. Please try again.');
  }
}
```
**Integration Points:**
- Triggered by delete confirmation modal
- Uses confirmation pattern (user must explicitly confirm)
- Refreshes all data views after deletion
- Shows user feedback on errors

---

### 6. GET /api/logs - Load Request Logs

**Frontend Function:** `loadLogs()`

**Purpose:** Fetches API request history for display in the logs panel.

**Code Flow:**
```javascript
async function loadLogs() {
  try {
    const logs = await apiRequest('GET', '/logs');
    renderLogs(logs);
  } catch (error) {
    console.error('Error loading logs:', error);
  }
}
```
**Integration Points:**
- Called on app initialization
- Called after every API operation that logs requests
- Renders last 10 requests in reverse chronological order
- Displays method badges, endpoints, and timestamps

**Response Processing:**
```javascript
function renderLogs(logs) {
  // Shows last 10 logs, reversed for newest first
  logs.slice(-10).reverse().forEach(log => {
    // Create log entry elements with method badges
  });
}
```

---

### 7. GET /api/stats - Load Task Statistics

**Frontend Function:** `loadStats()`

**Purpose:** Fetches task completion statistics for the doughnut chart.

**Code Flow:**
```javascript
async function loadStats() {
  try {
    const stats = await apiRequest('GET', '/stats');
    renderStats(stats);
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}
```
**Integration Points:**
- Called on app initialization
- Called after every task operation
- Updates Chart.js doughnut chart
- Shows completed vs pending task counts

**Chart Rendering:**
```javascript
function renderStats(stats) {
  statsChart = new Chart(statsChartCanvas, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [stats.completed, stats.pending],
        backgroundColor: ['#10B981', '#F59E0B'],
        // ... chart configuration
      }]
    }
  });
}
```

## Integration Patterns

### Data Refresh Strategy
All mutating operations (POST, PUT, DELETE) follow this pattern:
1. Make API call
2. Close any open modals
3. Refresh tasks (`loadTasks()`)
4. Refresh logs (`loadLogs()`)
5. Refresh stats (`loadStats()`)

### Error Handling Strategy
- **Silent failures:** Data loading functions log to console only
- **User-visible errors:** Form submissions show alert dialogs
- **Network errors:** All API calls can throw, caught by try/catch blocks

### Event-Driven Architecture
- **Form submissions:** Prevent default, validate, API call, refresh
- **Button clicks:** Delegated listeners on task grid
- **Modal interactions:** Focus management, keyboard navigation
- **Data updates:** Automatic refresh of all dependent components

### State Management
- **Server state:** All data stored in SQLite database
- **Client state:** Minimal, mostly UI state (modal visibility, current IDs)
- **Synchronization:** Full refresh after mutations (no optimistic updates)

## API Call Frequency

### On App Load
1. `GET /api/tasks` - Load initial tasks
2. `GET /api/logs` - Load initial logs
3. `GET /api/stats` - Load initial stats

### Per User Action
- **Add task:** 1 POST + 3 GETs (tasks, logs, stats)
- **Edit task:** 1 PUT + 3 GETs
- **Delete task:** 1 DELETE + 3 GETs
- **Toggle task:** 1 GET + 1 PUT + 3 GETs (5 total)

### Optimization Opportunities
- Batch refresh calls
- Implement optimistic updates
- Cache statistics locally
- Use WebSockets for real-time updates

## Network Error Scenarios

### Server Unavailable
- All API calls will throw network errors
- UI remains in last known state
- Error messages displayed for user actions

### Database Errors
- Backend returns 500 status
- Frontend catches and shows user alerts
- Data remains consistent (failed operations don't change UI)

### Validation Errors
- Backend returns 400 status for invalid data
- Frontend shows appropriate error messages
- Form remains open for correction

This comprehensive API integration ensures a responsive, reliable user experience with proper error handling and data synchronization between frontend and backend.