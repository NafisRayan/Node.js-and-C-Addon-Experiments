# Event Loop Visualizer

A comprehensive Node.js web application that visualizes and demonstrates the inner workings of the Event Loop, Web APIs, and (Micro)task Queue - the core asynchronous execution model of JavaScript and Node.js.

## 🎯 Features

- **Interactive Visualization**: Real-time visual representation of all Event Loop components
- **Task Management**: Add different types of tasks (synchronous, asynchronous, microtasks)
- **Live Simulation**: Start/stop the event loop to see execution in action
- **Animated Execution**: Visual feedback showing task processing with smooth animations
- **Console Logging**: Real-time output showing execution flow and timing
- **Educational Tool**: Perfect for understanding asynchronous JavaScript concepts

## 📚 Understanding the Event Loop

### What is the Event Loop?

The Event Loop is the core mechanism that enables JavaScript to perform non-blocking I/O operations despite being single-threaded. It allows Node.js to handle thousands of concurrent connections without creating multiple threads.

### Key Components

#### 1. **Call Stack** (LIFO - Last In, First Out)
- Stores function calls in execution order
- Each function call creates a new stack frame
- When a function completes, its frame is popped from the stack
- Stack overflow occurs when too many nested calls exceed memory limits

#### 2. **Web APIs / Node APIs**
- Browser APIs (setTimeout, fetch, DOM events) or Node.js APIs (fs, http, crypto)
- Handle asynchronous operations outside the JavaScript engine
- When an async operation completes, it queues a callback in the appropriate queue

#### 3. **Microtask Queue** (High Priority)
- Contains microtasks: Promises (.then, .catch, .finally), process.nextTick (Node.js), queueMicrotask
- Processed after each macrotask, before the next macrotask
- Higher priority than the Task Queue
- All microtasks are executed before yielding to the Task Queue

#### 4. **Task Queue** (Macrotask Queue)
- Contains macrotasks: setTimeout, setInterval, setImmediate, I/O operations
- Tasks are processed one at a time in FIFO order
- Lower priority than microtasks

### Execution Order (The Event Loop Algorithm)

The Event Loop follows this precise execution pattern:

```
1. Check Call Stack:
   - If empty, proceed to next step
   - If not empty, execute top function

2. Process ALL Microtasks:
   - Execute every microtask in the Microtask Queue
   - Continue until queue is empty
   - Microtasks can queue more microtasks

3. Process ONE Task from Task Queue:
   - Take the first (oldest) task from Task Queue
   - Execute it (which may add to Call Stack)
   - Return to step 1

4. Repeat indefinitely
```

### Practical Examples

#### Example 1: Basic setTimeout
```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

console.log('End');

// Output: Start, End, Timeout
```

**Why?** `setTimeout` callback goes to Task Queue, executed after Call Stack empties.

#### Example 2: Promises vs setTimeout
```javascript
console.log('Start');

setTimeout(() => console.log('Timeout'), 0);

Promise.resolve().then(() => console.log('Promise'));

console.log('End');

// Output: Start, End, Promise, Timeout
```

**Why?** Promise microtask executes before setTimeout macrotask.

#### Example 3: Microtask Queue Processing
```javascript
console.log('Start');

Promise.resolve().then(() => {
  console.log('Promise 1');
  Promise.resolve().then(() => console.log('Promise 1.1'));
});

Promise.resolve().then(() => console.log('Promise 2'));

console.log('End');

// Output: Start, End, Promise 1, Promise 1.1, Promise 2
```

**Why?** All microtasks execute before yielding, even nested ones.

## 🏗️ How This Visual Project Works

### Architecture Overview

This application consists of:
- **Backend**: Node.js Express server serving static files
- **Frontend**: Vanilla JavaScript with Tailwind CSS for styling
- **Simulation Engine**: Custom EventLoopSimulator class mimicking Node.js behavior

### Server-Side Code (`server.js`)

```javascript
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Event Loop Visualizer app listening at http://localhost:${PORT}`);
});
```

**How it works:**
- Creates an Express application instance
- Serves all files from the `public/` directory as static assets
- Routes root path (`/`) to `index.html`
- Starts HTTP server on port 3000

### Frontend Structure (`index.html`)

The HTML provides the visual layout with four main sections:

1. **Call Stack Display**: Shows currently executing synchronous tasks
2. **Web APIs Display**: Shows pending asynchronous operations
3. **Microtask Queue Display**: Shows queued microtasks
4. **Task Queue Display**: Shows queued macrotasks
5. **Control Panel**: Buttons for adding tasks and controlling simulation
6. **Console Output**: Real-time logging of execution events

**Styling**: Uses Tailwind CSS CDN for utility-first styling with responsive design.

### Simulation Engine (`script.js`)

#### Core Class: EventLoopSimulator

```javascript
class EventLoopSimulator {
  constructor() {
    this.callStack = [];
    this.webAPIs = [];
    this.microtaskQueue = [];
    this.taskQueue = [];
    this.isRunning = false;
    this.taskId = 0;
    this.bindEvents();
  }
}
```

**Data Structures:**
- `callStack`: Array simulating LIFO stack for synchronous execution
- `webAPIs`: Array holding async operations in progress
- `microtaskQueue`: Array for high-priority microtasks
- `taskQueue`: Array for low-priority macrotasks

#### Task Addition Methods

**addSyncTask():**
- Creates a task object with unique ID and type
- Pushes directly to `callStack`
- Updates UI and logs the action

**addAsyncTask():**
- Creates async task and adds to `webAPIs`
- Uses `setTimeout` to simulate async completion (2 seconds)
- Moves task from `webAPIs` to `taskQueue` when "completed"

**addMicrotask():**
- Creates microtask and adds directly to `microtaskQueue`

#### Event Loop Simulation (`runLoop()`)

```javascript
async runLoop() {
  while (this.isRunning) {
    // Process Call Stack
    if (this.callStack.length > 0) {
      const task = this.callStack.pop();
      await this.executeTask(task, 'call-stack-list');
    }

    // Process ALL Microtasks
    while (this.microtaskQueue.length > 0 && this.isRunning) {
      const task = this.microtaskQueue.shift();
      await this.executeTask(task, 'microtask-queue-list');
    }

    // Process ONE Task
    if (this.taskQueue.length > 0 && this.isRunning) {
      const task = this.taskQueue.shift();
      await this.executeTask(task, 'task-queue-list');
    }

    await this.delay(500); // Small delay for visibility
  }
}
```

**Execution Flow:**
1. **Call Stack Processing**: Pops and executes tasks (simulated with animation)
2. **Microtask Processing**: Executes ALL microtasks in FIFO order
3. **Task Processing**: Executes ONE task from Task Queue
4. **Cycle Delay**: 500ms pause to make execution visible

#### Task Execution (`executeTask()`)

```javascript
async executeTask(task, listId) {
  const list = document.getElementById(listId);
  const li = list.querySelector(`[data-id="${task.id}"]`);
  if (li) {
    li.className = 'bg-yellow-300 my-1 p-2 rounded transition-all duration-300 font-bold';
    await this.delay(1000); // Highlight for 1 second
    li.remove(); // Remove from DOM
  }
}
```

**Animation Details:**
- Changes background to yellow and makes text bold
- Waits 1 second for visual feedback
- Removes the element from the DOM

#### UI Updates (`updateUI()` and `updateList()`)

```javascript
updateList(listId, tasks) {
  const list = document.getElementById(listId);
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.name;
    li.setAttribute('data-id', task.id);
    li.className = 'bg-gray-200 my-1 p-2 rounded transition-all duration-300';
    list.appendChild(li);
  });
}
```

**UI Update Logic:**
- Clears existing list items
- Recreates DOM elements for each task
- Applies Tailwind classes for consistent styling
- Uses data attributes for task identification

#### Logging System

```javascript
log(message) {
  const consoleLog = document.getElementById('console-log');
  consoleLog.textContent += `[${new Date().toLocaleTimeString()}] ${message}\n`;
  consoleLog.scrollTop = consoleLog.scrollHeight; // Auto-scroll
}
```

**Logging Features:**
- Timestamps all messages
- Auto-scrolls to show latest entries
- Maintains execution history

### Simulation Accuracy

This visualization accurately represents Node.js Event Loop behavior:

- **Synchronous tasks** execute immediately on the Call Stack
- **Async operations** move through Web APIs → Task Queue
- **Microtasks** have higher priority than macrotasks
- **Single-threaded nature** is preserved (one task at a time)
- **Non-blocking I/O** is simulated with timers

### Limitations

- Simplified timing (real Event Loop has microsecond precision)
- No actual I/O operations (simulated with setTimeout)
- No error handling visualization
- Single browser tab simulation (real Node.js handles multiple connections)

## 🚀 Installation

1. **Prerequisites**: Node.js (v14 or higher) installed
2. **Clone/Download**: Get this repository
3. **Navigate**: `cd "Event Loop, Web APIs, (Micro)task Queue"`
4. **Fix PowerShell** (if needed):
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
   ```
5. **Install Dependencies**:
   ```bash
   npm install
   ```

## 🎮 Running the App

1. **Start Server**:
   ```bash
   npm start
   ```
   Or directly: `node server.js`

2. **Open Browser**: Navigate to `http://localhost:3000`

## 📖 How to Use

### Basic Usage
1. **Add Tasks**: Click buttons to add different task types
2. **Start Simulation**: Click "Start Event Loop"
3. **Observe**: Watch tasks move through queues and execute
4. **Stop/Reset**: Control the simulation as needed

### Task Types Explained

- **Synchronous Task**: Goes directly to Call Stack, executes immediately
- **Asynchronous Task**: Simulates I/O - moves to Web APIs, then Task Queue
- **Microtask**: High-priority task that executes before macrotasks

### Understanding the Visualization

- **Gray boxes**: Tasks waiting in queues
- **Yellow highlight**: Currently executing task
- **Console**: Real-time execution log with timestamps
- **Queue movement**: Visual representation of task lifecycle

## 📁 Project Structure

```
event-loop-visualizer/
├── server.js              # Express server setup
├── package.json           # Dependencies and scripts
├── README.md              # This detailed documentation
├── .gitignore             # Git ignore rules
└── public/
    ├── index.html         # Main UI with Tailwind CSS
    └── script.js          # Event Loop simulation logic
```

## 🛠️ Technologies Used

- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Minimal web framework for serving static files
- **Tailwind CSS**: Utility-first CSS framework via CDN
- **Vanilla JavaScript**: ES6+ classes and async/await for simulation
- **HTML5**: Semantic markup for accessibility

