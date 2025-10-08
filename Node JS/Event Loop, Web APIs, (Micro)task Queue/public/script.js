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

  bindEvents() {
    document.getElementById('add-sync-task').addEventListener('click', () => this.addSyncTask());
    document.getElementById('add-async-task').addEventListener('click', () => this.addAsyncTask());
    document.getElementById('add-microtask').addEventListener('click', () => this.addMicrotask());
    document.getElementById('start-loop').addEventListener('click', () => this.startLoop());
    document.getElementById('stop-loop').addEventListener('click', () => this.stopLoop());
    document.getElementById('reset').addEventListener('click', () => this.reset());
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
    setTimeout(() => {
      this.taskQueue.push(task);
      this.webAPIs = this.webAPIs.filter(t => t.id !== task.id);
      this.updateUI();
      this.log(`${task.name} moved from Web APIs to Task Queue`);
    }, 2000);
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
    this.updateUI();
    this.clearLog();
  }

  async runLoop() {
    while (this.isRunning) {
      // Process call stack
      if (this.callStack.length > 0) {
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