// API base URL
const API_BASE = 'http://localhost:3000/api';

// DOM elements
const taskGrid = document.getElementById('taskGrid');
const emptyState = document.getElementById('emptyState');
const addTaskBtn = document.getElementById('addTaskBtn');
const addFirstTaskBtn = document.getElementById('addFirstTaskBtn');
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const addTaskModal = document.getElementById('addTaskModal');
const closeAddModal = document.getElementById('closeAddModal');
const cancelAdd = document.getElementById('cancelAdd');

const editTaskModal = document.getElementById('editTaskModal');
const editTaskForm = document.getElementById('editTaskForm');
const editTaskTitle = document.getElementById('editTaskTitle');
const editTaskDescription = document.getElementById('editTaskDescription');
const closeEditModal = document.getElementById('closeEditModal');
const cancelEdit = document.getElementById('cancelEdit');

const deleteModal = document.getElementById('deleteModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');

const requestLog = document.getElementById('requestLog');
const clearLogBtn = document.getElementById('clearLogBtn');
const statsChartCanvas = document.getElementById('statsChart');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');

// Chart instance
let statsChart;
let currentEditId = null;
let currentDeleteId = null;

// Initialize the app
async function init() {
  await loadTasks();
  await loadLogs();
  await loadStats();
  setupEventListeners();
}

function setupEventListeners() {
  // Add task
  addTaskBtn.addEventListener('click', openAddModal);
  addFirstTaskBtn.addEventListener('click', openAddModal);
  taskForm.addEventListener('submit', handleTaskSubmit);
  closeAddModal.addEventListener('click', closeAddModalHandler);
  cancelAdd.addEventListener('click', closeAddModalHandler);

  // Edit task
  editTaskForm.addEventListener('submit', handleEditSubmit);
  closeEditModal.addEventListener('click', closeEditModalHandler);
  cancelEdit.addEventListener('click', closeEditModalHandler);

  // Delete task
  cancelDelete.addEventListener('click', closeDeleteModal);
  confirmDelete.addEventListener('click', handleDeleteConfirm);

  // Clear log
  clearLogBtn.addEventListener('click', clearLog);

  // Close modals on backdrop click
  [addTaskModal, editTaskModal, deleteModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // Close modals on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Delegated event listeners for task actions (toggle, edit, delete)
  taskGrid.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('[data-action="toggle"]');
    const editBtn = e.target.closest('[data-action="edit"]');
    const deleteBtn = e.target.closest('[data-action="delete"]');
    if (toggleBtn) {
      const id = toggleBtn.getAttribute('data-id');
      toggleTask(Number(id));
    } else if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      apiRequest('GET', `/tasks/${id}`).then(task => openEditModal(task));
    } else if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      openDeleteModal(Number(id));
    }
  });
}

function openAddModal() {
  // store opener for focus return
  addTaskModal.dataset.opener = document.activeElement ? document.activeElement.id || document.activeElement.tagName : '';
  addTaskModal.classList.remove('hidden');
  // focus first input
  setTimeout(() => taskTitle.focus(), 50);
}

function closeAddModalHandler() {
  addTaskModal.classList.add('hidden');
  taskForm.reset();
  // restore focus
  const opener = addTaskModal.dataset.opener;
  if (opener) {
    const el = document.getElementById(opener);
    if (el) el.focus();
  }
}

function openEditModal(task) {
  currentEditId = task.id;
  editTaskTitle.value = task.title;
  editTaskDescription.value = task.description;
  editTaskModal.dataset.opener = document.activeElement ? document.activeElement.id || document.activeElement.tagName : '';
  editTaskModal.classList.remove('hidden');
  setTimeout(() => editTaskTitle.focus(), 50);
}

function closeEditModalHandler() {
  editTaskModal.classList.add('hidden');
  editTaskForm.reset();
  currentEditId = null;
  const opener = editTaskModal.dataset.opener;
  if (opener) {
    const el = document.getElementById(opener);
    if (el) el.focus();
  }
}

function openDeleteModal(id) {
  currentDeleteId = id;
  deleteModal.dataset.opener = document.activeElement ? document.activeElement.id || document.activeElement.tagName : '';
  deleteModal.classList.remove('hidden');
  setTimeout(() => confirmDelete.focus(), 50);
}

function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  currentDeleteId = null;
  const opener = deleteModal.dataset.opener;
  if (opener) {
    const el = document.getElementById(opener);
    if (el) el.focus();
  }
}

function closeAllModals() {
  closeAddModalHandler();
  closeEditModalHandler();
  closeDeleteModal();
}

// API functions
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

// Task functions
async function loadTasks() {
  try {
    const tasks = await apiRequest('GET', '/tasks');
    renderTasks(tasks);
    updateHeaderStats(tasks);
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

function updateHeaderStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
}

function renderTasks(tasks) {
  taskGrid.innerHTML = '';
  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');
  tasks.forEach(task => {
    const taskElement = createTaskElement(task);
    taskGrid.appendChild(taskElement);
  });
}

function createTaskElement(task) {
  const div = document.createElement('div');
  div.className = `task-card bg-white rounded-xl shadow-md p-6 border-l-4 animate-fade-in ${task.completed ? 'border-green-500' : 'border-indigo-500'}`;
  div.innerHTML = `
    <div class="flex justify-between items-start mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''} mb-2">${task.title}</h3>
        <p class="text-gray-600 text-sm leading-relaxed">${task.description || 'No description'}</p>
      </div>
      <div class="flex space-x-2 ml-4" role="group" aria-label="Task actions">
        <button type="button" data-action="toggle" data-id="${task.id}" aria-label="${task.completed ? 'Mark as pending' : 'Mark as completed'}" class="p-2 rounded-lg ${task.completed ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'} transition duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${task.completed ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M15 12H9m0 0V8m0 4v4m0-4h6m-6 0H9'}"></path>
          </svg>
        </button>
        <button type="button" data-action="edit" data-id="${task.id}" aria-label="Edit task" class="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        <button type="button" data-action="delete" data-id="${task.id}" aria-label="Delete task" class="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
    <div class="flex justify-between items-center text-xs text-gray-500">
      <span>Created: ${new Date(task.createdAt).toLocaleDateString()}</span>
      <span class="px-2 py-1 rounded-full ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
        ${task.completed ? 'Completed' : 'Pending'}
      </span>
    </div>
  `;
  return div;
}

async function handleTaskSubmit(e) {
  e.preventDefault();
  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();

  if (!title) return;

  try {
    await apiRequest('POST', '/tasks', { title, description });
    closeAddModalHandler();
    await loadTasks();
    await loadLogs();
    await loadStats();
  } catch (error) {
    console.error('Error creating task:', error);
    alert('Error creating task. Please try again.');
  }
}

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

function editTask(id) {
  // Find the task data (you might want to store it or fetch it)
  // For simplicity, we'll fetch it
  apiRequest('GET', `/tasks/${id}`)
    .then(task => openEditModal(task))
    .catch(error => console.error('Error fetching task:', error));
}

function deleteTask(id) {
  openDeleteModal(id);
}

// Log functions
async function loadLogs() {
  try {
    const logs = await apiRequest('GET', '/logs');
    renderLogs(logs);
  } catch (error) {
    console.error('Error loading logs:', error);
  }
}

function renderLogs(logs) {
  requestLog.innerHTML = '';
  if (logs.length === 0) {
    requestLog.innerHTML = '<p class="text-gray-500 text-sm">No API requests yet</p>';
    return;
  }
  logs.slice(-10).reverse().forEach(log => {
    const logElement = document.createElement('div');
    logElement.className = 'flex items-center justify-between bg-gray-50 p-3 rounded-lg animate-fade-in';
    logElement.innerHTML = `
      <div class="flex items-center space-x-3">
        <span class="px-2 py-1 rounded text-xs font-medium ${getMethodBadgeClass(log.method)}">${log.method}</span>
        <span class="text-gray-700 text-sm">${log.endpoint}</span>
      </div>
      <span class="text-gray-500 text-xs">${new Date(log.timestamp).toLocaleTimeString()}</span>
    `;
    requestLog.appendChild(logElement);
  });
}

function getMethodBadgeClass(method) {
  switch (method) {
    case 'GET': return 'bg-blue-100 text-blue-800';
    case 'POST': return 'bg-green-100 text-green-800';
    case 'PUT': return 'bg-yellow-100 text-yellow-800';
    case 'DELETE': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

async function clearLog() {
  // Since we can't clear server logs, we'll just clear the display
  requestLog.innerHTML = '<p class="text-gray-500 text-sm">Log cleared</p>';
}

// Stats functions
async function loadStats() {
  try {
    const stats = await apiRequest('GET', '/stats');
    renderStats(stats);
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

function renderStats(stats) {
  if (statsChart) {
    statsChart.destroy();
  }

  statsChart = new Chart(statsChartCanvas, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{
        data: [stats.completed, stats.pending],
        backgroundColor: ['#10B981', '#F59E0B'],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      cutout: '70%',
    }
  });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);