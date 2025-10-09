class EventLoopSimulator {
  constructor() {
    this.callStack = [];
    this.webAPIs = [];
    this.microtaskQueue = [];
    this.taskQueue = [];
    this.isRunning = false;
    this.taskId = 0;
    this._pendingTimers = new Map(); // track timers for async tasks

    this.bindEvents();
  }

  bindEvents() {
    // Defensive DOM lookups: ensure elements exist before binding
    const bindIf = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
      else console.warn(`EventLoopSimulator: missing element with id="${id}"`);
    };

    bindIf('add-sync-task', () => this.addSyncTask());
    bindIf('add-async-task', () => this.addAsyncTask());
    bindIf('add-microtask', () => this.addMicrotask());
    bindIf('start-loop', () => this.startLoop());
    bindIf('stop-loop', () => this.stopLoop());
    bindIf('reset', () => this.reset());
  }

  addSyncTask() {
    const task = { id: ++this.taskId, type: 'sync', name: `Sync Task ${this.taskId}` };
    this.callStack.push(task);
    this.updateUI();
    this.log(`Added ${task.name} to Call Stack`);
  }

  addAsyncTask() {
    const task = { id: ++this.taskId, type: 'async', name: `Async Task ${this.taskId}` };
    this.webAPIs.push(task);
    this.updateUI();
    this.log(`Added ${task.name} to Web APIs`);
    // Simulate async operation completing
    const timeoutId = setTimeout(() => {
      // Only move the task if it's still present in webAPIs
      if (this.webAPIs.find(t => t.id === task.id)) {
        this.taskQueue.push(task);
        this.webAPIs = this.webAPIs.filter(t => t.id !== task.id);
        this.updateUI();
        this.log(`${task.name} moved from Web APIs to Task Queue`);
      }
      this._pendingTimers.delete(task.id);
    }, 2000);
    this._pendingTimers.set(task.id, timeoutId);
  }

  addMicrotask() {
    const task = { id: ++this.taskId, type: 'micro', name: `Microtask ${this.taskId}` };
    this.microtaskQueue.push(task);
    this.updateUI();
    this.log(`Added ${task.name} to Microtask Queue`);
  }

  startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.log('Event Loop started');
    this.runLoop();
  }

  stopLoop() {
    this.isRunning = false;
    this.log('Event Loop stopped');
  }

  reset() {
    this.callStack = [];
    this.webAPIs = [];
    this.microtaskQueue = [];
    this.taskQueue = [];
    this.taskId = 0;
    this.isRunning = false;
    // Clear any pending timers created by addAsyncTask
    for (const [, tid] of this._pendingTimers) {
      try { clearTimeout(tid); } catch (e) { /* ignore */ }
    }
    this._pendingTimers.clear();
    this.updateUI();
    this.clearLog();
  }

  async runLoop() {
    while (this.isRunning) {
      // Process entire call stack (synchronous LIFO execution)
      while (this.callStack.length > 0 && this.isRunning) {
        const task = this.callStack.pop();
        await this.executeTask(task, 'call-stack-list');
        this.log(`Executed ${task.name} from Call Stack`);
      }

      // Process microtask queue
      while (this.microtaskQueue.length > 0 && this.isRunning) {
        const task = this.microtaskQueue.shift();
        await this.executeTask(task, 'microtask-queue-list');
        this.log(`Executed ${task.name} from Microtask Queue`);
      }

      // Process one task from task queue
      if (this.taskQueue.length > 0 && this.isRunning) {
        const task = this.taskQueue.shift();
        await this.executeTask(task, 'task-queue-list');
        this.log(`Executed ${task.name} from Task Queue`);
      }

      // Small delay to make it visible
      await this.delay(500);
    }
  }

  async executeTask(task, listId) {
    const list = document.getElementById(listId);
    if (!list) return;
    const li = list.querySelector(`[data-id="${task.id}"]`);
    if (li) {
      li.className = 'bg-yellow-300 my-1 p-2 rounded transition-all duration-300 font-bold';
      await this.delay(1000);
      li.remove();
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateUI() {
    this.updateList('call-stack-list', this.callStack);
    this.updateList('web-apis-list', this.webAPIs);
    this.updateList('microtask-queue-list', this.microtaskQueue);
    this.updateList('task-queue-list', this.taskQueue);
  }

  updateList(listId, tasks) {
    const list = document.getElementById(listId);
    if (!list) {
      console.warn(`EventLoopSimulator: updateList() missing list element id="${listId}"`);
      return;
    }
    list.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.name;
      li.setAttribute('data-id', task.id);
      li.className = 'bg-gray-200 my-1 p-2 rounded transition-all duration-300';
      list.appendChild(li);
    });
  }

  log(message) {
    const consoleLog = document.getElementById('console-log');
    consoleLog.textContent += `[${new Date().toLocaleTimeString()}] ${message}\n`;
    consoleLog.scrollTop = consoleLog.scrollHeight;
  }

  clearLog() {
    document.getElementById('console-log').textContent = '';
  }
}

// Initialize the simulator
new EventLoopSimulator();