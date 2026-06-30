import './style.css';

// ==========================================
// 1. KHỞI TẠO TRẠNG THÁI ỨNG DỤNG (STATE)
// ==========================================
let state = {
  theme: localStorage.getItem('zenith-theme') || 'light',
  currentView: 'dashboard',
  tasks: JSON.parse(localStorage.getItem('zenith-tasks')) || [
    {
      id: 'task-1',
      title: 'Thiết kế giao diện dashboard',
      description: 'Lên outline và phong cách thiết kế glassmorphism cho Zenith Workspace.',
      priority: 'high',
      category: 'work',
      completed: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      title: 'Thiết lập logic JavaScript thuần',
      description: 'Xây dựng trình quản lý state cơ bản và kết nối các sự kiện DOM.',
      priority: 'medium',
      category: 'work',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      title: 'Luyện tập phương pháp Pomodoro',
      description: 'Chạy thử nghiệm 2 phiên tập trung 25 phút để hoàn thành nhiệm vụ.',
      priority: 'low',
      category: 'study',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ],
  focusTimeTotal: parseInt(localStorage.getItem('zenith-focus-time')) || 0,
  
  // Timer State
  timer: {
    duration: 1500, // 25 phút mặc định (giây)
    timeLeft: 1500,
    isRunning: false,
    mode: 'pomodoro', // pomodoro, short-break, long-break
    intervalId: null
  },
  
  // Task filter state
  taskFilter: 'all', // all, pending, completed
  searchQuery: ''
};

// ==========================================
// 2. DOM ELEMENTS SELECTORS
// ==========================================
const DOM = {
  // Theme & Layout
  app: document.getElementById('app'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  
  // Navigation Links
  menuDashboard: document.getElementById('menu-dashboard-link'),
  menuTasks: document.getElementById('menu-tasks-link'),
  menuTimer: document.getElementById('menu-timer-link'),
  gotoTasksBtn: document.getElementById('goto-tasks-btn'),
  dashboardNewTaskBtn: document.getElementById('dashboard-new-task-btn'),
  
  // Views
  viewDashboard: document.getElementById('view-dashboard'),
  viewTasks: document.getElementById('view-tasks'),
  viewTimer: document.getElementById('view-timer'),
  
  // Stats
  statTotalTasks: document.getElementById('stat-total-tasks'),
  statCompletedTasks: document.getElementById('stat-completed-tasks'),
  statCompletionRate: document.getElementById('stat-completion-rate'),
  statFocusTime: document.getElementById('stat-focus-time'),
  taskBadgeCount: document.getElementById('task-badge-count'),
  
  // Search & Filters
  globalSearch: document.getElementById('global-search-input'),
  filterAll: document.getElementById('filter-all-btn'),
  filterPending: document.getElementById('filter-pending-btn'),
  filterCompleted: document.getElementById('filter-completed-btn'),
  
  // Tasks Lists & Form
  tasksList: document.getElementById('tasks-list'),
  recentTasksContainer: document.getElementById('recent-tasks-container'),
  taskForm: document.getElementById('task-form'),
  taskTitle: document.getElementById('task-title'),
  taskDesc: document.getElementById('task-desc'),
  taskPriority: document.getElementById('task-priority'),
  taskCategory: document.getElementById('task-category'),
  
  // Timer Elements
  timerDisplay: document.getElementById('timer-time-display'),
  timerModeLabel: document.getElementById('timer-mode-label'),
  timerPlayBtn: document.getElementById('timer-play-btn'),
  timerResetBtn: document.getElementById('timer-reset-btn'),
  timerSkipBtn: document.getElementById('timer-skip-btn'),
  timerProgressRing: document.getElementById('timer-progress-ring'),
  timerQuickBtns: document.querySelectorAll('.timer-config-btn'),
  
  // Mini Timer Elements
  miniTimerDisplay: document.getElementById('mini-timer-display'),
  miniTimerPlayBtn: document.getElementById('mini-timer-play-btn'),
  
  // Audio & Utilities
  bellSound: document.getElementById('bell-sound'),
  notificationBtn: document.getElementById('notification-btn')
};

// SVG Circle circumference config
const CIRCUMFERENCE = 2 * Math.PI * 120; // r=120 -> 753.98
if (DOM.timerProgressRing) {
  DOM.timerProgressRing.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
  DOM.timerProgressRing.style.strokeDashoffset = CIRCUMFERENCE;
}

// ==========================================
// 3. CORE FUNCTIONS (BUSINESS LOGIC)
// ==========================================

// --- Theme Management ---
function initTheme() {
  if (state.theme === 'dark') {
    DOM.app.classList.add('dark-theme');
  } else {
    DOM.app.classList.remove('dark-theme');
  }
  updateThemeButtonUI();
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('zenith-theme', state.theme);
  DOM.app.classList.toggle('dark-theme');
  updateThemeButtonUI();
  
  // Add a nice ripple effect / micro-animation trigger
  const btn = DOM.themeToggleBtn;
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    btn.style.transform = 'scale(1)';
  }, 100);
}

function updateThemeButtonUI() {
  const textSpan = DOM.themeToggleBtn.querySelector('.theme-text');
  if (state.theme === 'dark') {
    if (textSpan) textSpan.textContent = 'Chế độ sáng';
  } else {
    if (textSpan) textSpan.textContent = 'Chế độ tối';
  }
}

// --- Navigation / View Management ---
function switchView(viewName) {
  state.currentView = viewName;
  
  // Update view classes
  [DOM.viewDashboard, DOM.viewTasks, DOM.viewTimer].forEach(view => {
    view.classList.remove('active');
  });
  
  // Update sidebar menu items active state
  [DOM.menuDashboard, DOM.menuTasks, DOM.menuTimer].forEach(link => {
    link.classList.remove('active');
  });
  
  if (viewName === 'dashboard') {
    DOM.viewDashboard.classList.add('active');
    DOM.menuDashboard.classList.add('active');
  } else if (viewName === 'tasks') {
    DOM.viewTasks.classList.add('active');
    DOM.menuTasks.classList.add('active');
  } else if (viewName === 'timer') {
    DOM.viewTimer.classList.add('active');
    DOM.menuTimer.classList.add('active');
  }
}

// --- Tasks Management ---
function saveTasks() {
  localStorage.setItem('zenith-tasks', JSON.stringify(state.tasks));
  updateStats();
  renderTasks();
  renderRecentTasks();
}

function addTask(title, description, priority, category) {
  const newTask = {
    id: `task-${Date.now()}`,
    title,
    description,
    priority,
    category,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  state.tasks.unshift(newTask);
  saveTasks();
}

function toggleTaskComplete(taskId) {
  state.tasks = state.tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter(task => task.id !== taskId);
  saveTasks();
}

// --- Stats calculation ---
function updateStats() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // Update values in DOM
  DOM.statTotalTasks.textContent = total;
  DOM.statCompletedTasks.textContent = completed;
  DOM.statCompletionRate.textContent = `${rate}% tỷ lệ đạt được`;
  DOM.statFocusTime.textContent = `${state.focusTimeTotal}m`;
  DOM.taskBadgeCount.textContent = pending;
  
  // Show/hide badge count if 0
  if (pending === 0) {
    DOM.taskBadgeCount.style.display = 'none';
  } else {
    DOM.taskBadgeCount.style.display = 'inline-flex';
  }
}

// --- Timer Management (Pomodoro) ---
function setProgress(percent) {
  if (!DOM.timerProgressRing) return;
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
  DOM.timerProgressRing.style.strokeDashoffset = offset;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
  const formatted = formatTime(state.timer.timeLeft);
  DOM.timerDisplay.textContent = formatted;
  DOM.miniTimerDisplay.textContent = formatted;
  
  // Update browser window tab title
  const modeText = state.timer.mode === 'pomodoro' ? 'Tập trung' : 'Nghỉ ngơi';
  document.title = `(${formatted}) Zenith Workspace - ${modeText}`;
  
  // Progress Ring Calculation
  const total = state.timer.duration;
  const elapsed = total - state.timer.timeLeft;
  const percentage = total > 0 ? (elapsed / total) * 100 : 0;
  setProgress(percentage);
}

function startTimer() {
  if (state.timer.isRunning) return;
  
  state.timer.isRunning = true;
  updateTimerControlButtons();
  
  state.timer.intervalId = setInterval(() => {
    state.timer.timeLeft--;
    updateTimerDisplay();
    
    if (state.timer.timeLeft <= 0) {
      clearInterval(state.timer.intervalId);
      timerFinished();
    }
  }, 1000);
}

function pauseTimer() {
  if (!state.timer.isRunning) return;
  
  clearInterval(state.timer.intervalId);
  state.timer.isRunning = false;
  updateTimerControlButtons();
}

function resetTimer() {
  clearInterval(state.timer.intervalId);
  state.timer.isRunning = false;
  state.timer.timeLeft = state.timer.duration;
  updateTimerDisplay();
  updateTimerControlButtons();
}

function timerFinished() {
  state.timer.isRunning = false;
  
  // Play sound
  if (DOM.bellSound) {
    DOM.bellSound.currentTime = 0;
    DOM.bellSound.play().catch(e => console.log('Không thể phát âm thanh thông báo: ', e));
  }
  
  // Logic for completed session
  if (state.timer.mode === 'pomodoro') {
    const focusMinutes = Math.round(state.timer.duration / 60);
    state.focusTimeTotal += focusMinutes;
    localStorage.setItem('zenith-focus-time', state.focusTimeTotal);
    updateStats();
    
    alert(`🎉 Phiên tập trung của bạn đã hoàn tất! +${focusMinutes} phút thời gian tập trung.`);
    
    // Switch to short break automatically
    switchTimerMode('short-break', 300);
  } else {
    alert('☕ Hết thời gian nghỉ ngơi! Hãy quay lại bàn làm việc thôi.');
    switchTimerMode('pomodoro', 1500);
  }
  
  updateTimerControlButtons();
}

function switchTimerMode(mode, durationSeconds) {
  clearInterval(state.timer.intervalId);
  state.timer.isRunning = false;
  state.timer.mode = mode;
  state.timer.duration = durationSeconds;
  state.timer.timeLeft = durationSeconds;
  
  // Update Active Button in configurations
  DOM.timerQuickBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.mode === mode) {
      btn.classList.add('active');
    }
  });
  
  // Update Mode Label
  if (mode === 'pomodoro') {
    DOM.timerModeLabel.textContent = 'Tập trung';
  } else if (mode === 'short-break') {
    DOM.timerModeLabel.textContent = 'Nghỉ ngắn';
  } else if (mode === 'long-break') {
    DOM.timerModeLabel.textContent = 'Nghỉ dài';
  }
  
  updateTimerDisplay();
  updateTimerControlButtons();
}

function skipTimer() {
  if (confirm('Bạn có muốn bỏ qua phiên hiện tại không?')) {
    if (state.timer.mode === 'pomodoro') {
      switchTimerMode('short-break', 300);
    } else {
      switchTimerMode('pomodoro', 1500);
    }
  }
}

function updateTimerControlButtons() {
  const playIconClass = state.timer.isRunning ? 'fa-pause' : 'fa-play';
  
  // Main screen play button icon
  DOM.timerPlayBtn.innerHTML = `<i class="fa-solid ${playIconClass}"></i>`;
  
  // Mini dashboard timer play button icon
  DOM.miniTimerPlayBtn.innerHTML = `<i class="fa-solid ${playIconClass}"></i>`;
}

// ==========================================
// 4. RENDERING FUNCTIONS (UI BUILDERS)
// ==========================================

// Render tasks list in Tasks View
function renderTasks() {
  if (!DOM.tasksList) return;
  
  // Apply Search and Tab Filters
  let filtered = state.tasks;
  
  // Tab Filter
  if (state.taskFilter === 'pending') {
    filtered = filtered.filter(t => !t.completed);
  } else if (state.taskFilter === 'completed') {
    filtered = filtered.filter(t => t.completed);
  }
  
  // Global search filter
  if (state.searchQuery.trim() !== '') {
    const query = state.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(query) || 
      t.description.toLowerCase().includes(query)
    );
  }
  
  if (filtered.length === 0) {
    DOM.tasksList.innerHTML = `<div class="empty-state">Không tìm thấy nhiệm vụ nào phù hợp.</div>`;
    return;
  }
  
  DOM.tasksList.innerHTML = filtered.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
      <div class="task-checkbox-wrapper">
        <button class="task-checkbox" aria-label="Hoàn thành nhiệm vụ">
          <i class="fa-solid fa-check"></i>
        </button>
      </div>
      <div class="task-details">
        <h3 class="task-item-title">${escapeHTML(task.title)}</h3>
        ${task.description ? `<p class="task-item-desc">${escapeHTML(task.description)}</p>` : ''}
        <div class="task-meta-tags">
          <span class="tag tag-priority-${task.priority}">
            <i class="fa-solid fa-circle-exclamation"></i> Ưu tiên ${task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
          </span>
          <span class="tag tag-category">
            <i class="fa-solid fa-folder"></i> ${task.category}
          </span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-action-delete" title="Xóa nhiệm vụ" aria-label="Xóa nhiệm vụ">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  // Attach Event Listeners to rendered tasks list
  attachTaskItemListeners(DOM.tasksList);
}

// Render top/recent pending tasks in Dashboard View
function renderRecentTasks() {
  if (!DOM.recentTasksContainer) return;
  
  // Only render pending tasks, sorted by priority (high -> medium -> low), then latest
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  
  const pendingTasks = state.tasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (pDiff !== 0) return pDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .slice(0, 3); // top 3 tasks
  
  if (pendingTasks.length === 0) {
    DOM.recentTasksContainer.innerHTML = `<div class="empty-state">Không có nhiệm vụ ưu tiên nào đang chờ. Bạn thật tuyệt vời!</div>`;
    return;
  }
  
  DOM.recentTasksContainer.innerHTML = pendingTasks.map(task => `
    <div class="task-item" data-id="${task.id}">
      <div class="task-checkbox-wrapper">
        <button class="task-checkbox" aria-label="Hoàn thành nhiệm vụ">
          <i class="fa-solid fa-check"></i>
        </button>
      </div>
      <div class="task-details">
        <h3 class="task-item-title">${escapeHTML(task.title)}</h3>
        <div class="task-meta-tags">
          <span class="tag tag-priority-${task.priority}">
            <i class="fa-solid fa-circle-exclamation"></i> Ưu tiên ${task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
          </span>
          <span class="tag tag-category">
            <i class="fa-solid fa-folder"></i> ${task.category}
          </span>
        </div>
      </div>
    </div>
  `).join('');
  
  // Attach Event Listeners to rendered recent tasks
  attachTaskItemListeners(DOM.recentTasksContainer);
}

function attachTaskItemListeners(container) {
  container.querySelectorAll('.task-item').forEach(item => {
    const taskId = item.dataset.id;
    
    // Checkbox click to toggle complete
    const checkbox = item.querySelector('.task-checkbox');
    if (checkbox) {
      checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTaskComplete(taskId);
      });
    }
    
    // Delete action
    const deleteBtn = item.querySelector('.btn-action-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Bạn chắc chắn muốn xóa nhiệm vụ này chứ?')) {
          deleteTask(taskId);
        }
      });
    }
  });
}

// Utility function to prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// ==========================================
// 5. EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {
  
  // Theme Toggle Event
  DOM.themeToggleBtn.addEventListener('click', toggleTheme);
  
  // Search & Navigation Events
  DOM.menuDashboard.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('dashboard');
  });
  
  DOM.menuTasks.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('tasks');
  });
  
  DOM.menuTimer.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('timer');
  });
  
  DOM.gotoTasksBtn.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('tasks');
  });
  
  DOM.dashboardNewTaskBtn.addEventListener('click', () => {
    switchView('tasks');
    setTimeout(() => {
      DOM.taskTitle.focus();
    }, 150);
  });
  
  // Global search input
  DOM.globalSearch.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    // Auto switch to tasks view if searching, or keep rendering current view
    if (state.currentView !== 'tasks') {
      switchView('tasks');
    }
    renderTasks();
  });
  
  // Notification bell demo click
  DOM.notificationBtn.addEventListener('click', () => {
    alert('🔔 Bạn chưa có thông báo mới nào.');
  });
  
  // Task Creator Form Submit
  DOM.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = DOM.taskTitle.value.trim();
    const desc = DOM.taskDesc.value.trim();
    const priority = DOM.taskPriority.value;
    const category = DOM.taskCategory.value;
    
    if (title === '') return;
    
    addTask(title, desc, priority, category);
    
    // Reset Form
    DOM.taskForm.reset();
    DOM.taskTitle.focus();
  });
  
  // Tasks Filtering Tabs
  DOM.filterAll.addEventListener('click', () => {
    updateFilterTabsUI('all');
    state.taskFilter = 'all';
    renderTasks();
  });
  
  DOM.filterPending.addEventListener('click', () => {
    updateFilterTabsUI('pending');
    state.taskFilter = 'pending';
    renderTasks();
  });
  
  DOM.filterCompleted.addEventListener('click', () => {
    updateFilterTabsUI('completed');
    state.taskFilter = 'completed';
    renderTasks();
  });
  
  // --- Timer Event Listeners ---
  DOM.timerPlayBtn.addEventListener('click', () => {
    if (state.timer.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });
  
  // Mini timer play button sync
  DOM.miniTimerPlayBtn.addEventListener('click', () => {
    if (state.timer.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });
  
  DOM.timerResetBtn.addEventListener('click', resetTimer);
  DOM.timerSkipBtn.addEventListener('click', skipTimer);
  
  // Timer Quick configs
  DOM.timerQuickBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mode = e.target.dataset.mode;
      const seconds = parseInt(e.target.dataset.time);
      switchTimerMode(mode, seconds);
    });
  });
}

function updateFilterTabsUI(activeFilter) {
  [DOM.filterAll, DOM.filterPending, DOM.filterCompleted].forEach(tab => {
    tab.classList.remove('active');
  });
  
  if (activeFilter === 'all') DOM.filterAll.classList.add('active');
  if (activeFilter === 'pending') DOM.filterPending.classList.add('active');
  if (activeFilter === 'completed') DOM.filterCompleted.classList.add('active');
}

// ==========================================
// 6. INITIALIZATION
// ==========================================
function init() {
  initTheme();
  updateStats();
  renderTasks();
  renderRecentTasks();
  updateTimerDisplay();
  setupEventListeners();
}

// Run application on load
window.addEventListener('DOMContentLoaded', init);
