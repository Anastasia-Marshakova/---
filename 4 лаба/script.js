class ToDoApp {
            constructor() {
                this.tasks = this.loadTasks();
                this.currentView = 'list';
                this.selectedImportance = 5;
                this.selectedUrgency = 4;
                this.initElements();
                this.bindEvents();
                this.render();
                this.startDateTimeCheck();
            }

            initElements() {
                this.taskNameInput = document.getElementById('taskName');
                this.taskDescriptionInput = document.getElementById('taskDescription');
                this.taskDateInput = document.getElementById('taskDate');
                this.taskTimeInput = document.getElementById('taskTime');
                this.taskStatusInput = document.getElementById('taskStatus');
                this.addTaskBtn = document.getElementById('addTaskBtn');
                this.taskList = document.getElementById('taskList');
                this.nameGroup = document.getElementById('nameGroup');
                this.totalTasksEl = document.getElementById('totalTasks');
                this.completedTasksEl = document.getElementById('completedTasks');
                this.pendingTasksEl = document.getElementById('pendingTasks');
                this.urgentImportantTasksEl = document.getElementById('urgentImportantTasks');
                this.filterStatus = document.getElementById('filterStatus');
                this.filterQuadrant = document.getElementById('filterQuadrant');
                this.sortBy = document.getElementById('sortBy');
                this.importanceRating = document.getElementById('importanceRating');
                this.urgencyRating = document.getElementById('urgencyRating');
                this.listContainer = document.getElementById('listContainer');
                this.matrixContainer = document.getElementById('matrixContainer');
                this.viewBtns = document.querySelectorAll('.view-btn');
                
                
                this.quadrant1Tasks = document.getElementById('quadrant1Tasks');
                this.quadrant2Tasks = document.getElementById('quadrant2Tasks');
                this.quadrant3Tasks = document.getElementById('quadrant3Tasks');
                this.quadrant4Tasks = document.getElementById('quadrant4Tasks');
                
                
                this.q1Count = document.getElementById('q1Count');
                this.q2Count = document.getElementById('q2Count');
                this.q3Count = document.getElementById('q3Count');
                this.q4Count = document.getElementById('q4Count');
            }

            bindEvents() {
                this.addTaskBtn.addEventListener('click', () => this.addTask());
                this.taskNameInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.addTask();
                    }
                });
                this.filterStatus.addEventListener('change', () => this.render());
                this.filterQuadrant.addEventListener('change', () => this.render());
                this.sortBy.addEventListener('change', () => this.render());

                
                this.importanceRating.querySelectorAll('.rating-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        this.importanceRating.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        this.selectedImportance = parseInt(btn.dataset.value);
                    });
                });

                this.urgencyRating.querySelectorAll('.rating-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        this.urgencyRating.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        this.selectedUrgency = parseInt(btn.dataset.value);
                    });
                });

                
                this.viewBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        this.viewBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.currentView = btn.dataset.view;
                        this.toggleView();
                    });
                });
            }

            toggleView() {
                if (this.currentView === 'list') {
                    this.listContainer.classList.remove('hidden');
                    this.matrixContainer.classList.remove('active');
                    this.renderList();
                } else {
                    this.listContainer.classList.add('hidden');
                    this.matrixContainer.classList.add('active');
                    this.renderMatrix();
                }
            }

            loadTasks() {
                const saved = localStorage.getItem('todoTasks');
                return saved ? JSON.parse(saved) : [];
            }

            saveTasks() {
                localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
            }

            getQuadrant(importance, urgency) {
                if (importance >= 3 && urgency >= 3) return 1; // Срочно и важно
                if (importance >= 3 && urgency < 3) return 2; // Важно, не срочно
                if (importance < 3 && urgency >= 3) return 3; // Срочно, не важно
                return 4; // Не срочно и не важно
            }

            getQuadrantInfo(quadrant) {
                const quadrants = {
                    1: { name: 'Срочно и важно', action: 'Сделать сейчас', color: '#f44336', icon: '🔥' },
                    2: { name: 'Важно, не срочно', action: 'Запланировать', color: '#2196f3', icon: '📅' },
                    3: { name: 'Срочно, не важно', action: 'Делегировать', color: '#ff9800', icon: '⚡' },
                    4: { name: 'Не срочно и не важно', action: 'Удалить/отложить', color: '#9e9e9e', icon: '🗑️' }
                };
                return quadrants[quadrant];
            }

            addTask() {
                const name = this.taskNameInput.value.trim();
                const description = this.taskDescriptionInput.value.trim();
                const date = this.taskDateInput.value;
                const time = this.taskTimeInput.value;
                const status = this.taskStatusInput.value;

                
                if (!name) {
                    this.nameGroup.classList.add('error');
                    this.taskNameInput.focus();
                    return;
                }

                this.nameGroup.classList.remove('error');

                let dateTime = null;
                if (date) {
                    dateTime = date;
                    if (time) {
                        dateTime += ' ' + time;
                    }
                }

                const task = {
                    id: Date.now(),
                    name: name,
                    description: description,
                    completed: status === 'completed',
                    status: status,
                    importance: this.selectedImportance,
                    urgency: this.selectedUrgency,
                    dateTime: dateTime,
                    createdAt: new Date().toISOString()
                };

                this.tasks.unshift(task);
                this.saveTasks();
                this.render();

                
                this.taskNameInput.value = '';
                this.taskDescriptionInput.value = '';
                this.taskDateInput.value = '';
                this.taskTimeInput.value = '';
                this.taskNameInput.focus();
            }

            toggleTask(id) {
                const task = this.tasks.find(t => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    task.status = task.completed ? 'completed' : 'pending';
                    this.saveTasks();
                    this.render();
                }
            }

            updateTaskStatus(id, newStatus) {
                const task = this.tasks.find(t => t.id === id);
                if (task) {
                    task.status = newStatus;
                    task.completed = newStatus === 'completed';
                    this.saveTasks();
                    this.render();
                }
            }

            deleteTask(id) {
                this.tasks = this.tasks.filter(t => t.id !== id);
                this.saveTasks();
                this.render();
            }

            updateStats() {
                const total = this.tasks.length;
                const completed = this.tasks.filter(t => t.completed).length;
                const pending = this.tasks.filter(t => !t.completed).length;
                const urgentImportant = this.tasks.filter(t => 
                    !t.completed && t.importance >= 3 && t.urgency >= 3
                ).length;

                this.totalTasksEl.textContent = total;
                this.completedTasksEl.textContent = completed;
                this.pendingTasksEl.textContent = pending;
                this.urgentImportantTasksEl.textContent = urgentImportant;
            }

            getFilteredAndSortedTasks() {
                let filtered = [...this.tasks];

                
                const statusFilter = this.filterStatus.value;
                if (statusFilter !== 'all') {
                    if (statusFilter === 'completed') {
                        filtered = filtered.filter(t => t.completed);
                    } else if (statusFilter === 'pending') {
                        filtered = filtered.filter(t => t.status === 'pending');
                    } else if (statusFilter === 'in-progress') {
                        filtered = filtered.filter(t => t.status === 'in-progress');
                    }
                }

                
                const quadrantFilter = this.filterQuadrant.value;
                if (quadrantFilter !== 'all') {
                    const qNum = parseInt(quadrantFilter);
                    filtered = filtered.filter(t => this.getQuadrant(t.importance, t.urgency) === qNum);
                }

                
                const sortType = this.sortBy.value;
                if (sortType === 'newest') {
                    filtered.sort((a, b) => b.id - a.id);
                } else if (sortType === 'oldest') {
                    filtered.sort((a, b) => a.id - b.id);
                } else if (sortType === 'date') {
                    filtered.sort((a, b) => {
                        if (!a.dateTime && !b.dateTime) return 0;
                        if (!a.dateTime) return 1;
                        if (!b.dateTime) return -1;
                        return new Date(a.dateTime) - new Date(b.dateTime);
                    });
                } else if (sortType === 'importance') {
                    filtered.sort((a, b) => b.importance - a.importance);
                } else if (sortType === 'urgency') {
                    filtered.sort((a, b) => b.urgency - a.urgency);
                } else if (sortType === 'name') {
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                }

                return filtered;
            }

            formatDateTime(dateTimeStr) {
                if (!dateTimeStr) return null;
                
                const dateObj = new Date(dateTimeStr);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const taskDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
                
                const options = { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric'
                };
                let formatted = taskDate.toLocaleDateString('ru-RU', options);
                
                if (dateTimeStr.includes(' ')) {
                    const timePart = dateTimeStr.split(' ')[1];
                    if (timePart) {
                        formatted += ', ' + timePart;
                    }
                }

                let status = '';
                if (!this.isCompleted(dateTimeStr) && taskDate < today) {
                    status = 'overdue';
                } else if (taskDate.getTime() === today.getTime()) {
                    status = 'today';
                }

                return { formatted, status };
            }

            isCompleted(dateTimeStr) {
                const task = this.tasks.find(t => t.dateTime === dateTimeStr);
                return task ? task.completed : false;
            }

            getTaskDateStatus(dateTimeStr, completed) {
                if (!dateTimeStr || completed) return '';
                
                const dateObj = new Date(dateTimeStr);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const taskDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
                
                if (taskDate < today) {
                    return 'overdue';
                } else if (taskDate.getTime() === today.getTime()) {
                    return 'today';
                }
                return '';
            }

            getStatusLabel(status) {
                const labels = {
                    'pending': 'В ожидании',
                    'in-progress': 'В работе',
                    'completed': 'Выполнено'
                };
                return labels[status] || status;
            }

            render() {
                this.updateStats();
                if (this.currentView === 'list') {
                    this.renderList();
                } else {
                    this.renderMatrix();
                }
            }

            renderList() {
                const filteredTasks = this.getFilteredAndSortedTasks();

                if (filteredTasks.length === 0) {
                    this.taskList.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon"></div>
                            <h3>Нет задач</h3>
                            <p>Добавьте свою первую задачу выше!</p>
                        </div>
                    `;
                    return;
                }

                this.taskList.innerHTML = filteredTasks.map(task => {
                    const dateStatus = this.getTaskDateStatus(task.dateTime, task.completed);
                    const dateTimeInfo = this.formatDateTime(task.dateTime);
                    const quadrant = this.getQuadrant(task.importance, task.urgency);
                    const quadrantInfo = this.getQuadrantInfo(quadrant);
                    
                    return `
                        <div class="task-item ${task.completed ? 'completed' : ''} ${dateStatus}" data-id="${task.id}" style="border-left: 4px solid ${quadrantInfo.color}">
                            <div class="checkbox-wrapper">
                                <input 
                                    type="checkbox" 
                                    ${task.completed ? 'checked' : ''} 
                                    onchange="app.toggleTask(${task.id})"
                                >
                            </div>
                            <div class="task-content">
                                <div class="task-name">${this.escapeHtml(task.name)}</div>
                                <div class="task-description">${this.escapeHtml(task.description)}</div>
                                <div class="task-meta">
                                    ${dateTimeInfo ? `
                                        <div class="task-datetime ${dateTimeInfo.status}">
                                            <span class="task-datetime-icon"></span>
                                            <span>${dateTimeInfo.formatted}</span>
                                        </div>
                                    ` : ''}
                                    <div class="task-rating">
                                        <span class="task-rating-icon"></span>
                                        <span class="importance">Важность: ${task.importance}/5</span>
                                    </div>
                                    <div class="task-rating">
                                        <span class="task-rating-icon"></span>
                                        <span class="urgency">Срочность: ${task.urgency}/5</span>
                                    </div>
                                    <div class="task-rating">
                                        <span class="task-rating-icon"></span>
                                        <span>${quadrantInfo.icon} Квадрант ${quadrant}</span>
                                    </div>
                                    <div class="task-rating">
                                        <span class="task-rating-icon"></span>
                                        <span>${this.getStatusLabel(task.status)}</span>
                                    </div>
                                </div>
                            </div>
                            <button class="delete-btn" onclick="app.deleteTask(${task.id})">
                                
                            </button>
                        </div>
                    `;
                }).join('');
            }

            renderMatrix() {
                const quadrantTasks = {
                    1: [],
                    2: [],
                    3: [],
                    4: []
                };

                this.tasks.forEach(task => {
                    if (!task.completed) {
                        const quadrant = this.getQuadrant(task.importance, task.urgency);
                        quadrantTasks[quadrant].push(task);
                    }
                });

                
                this.q1Count.textContent = quadrantTasks[1].length;
                this.q2Count.textContent = quadrantTasks[2].length;
                this.q3Count.textContent = quadrantTasks[3].length;
                this.q4Count.textContent = quadrantTasks[4].length;

                
                Object.keys(quadrantTasks).forEach(q => {
                    quadrantTasks[q].sort((a, b) => {
                        if (q == 1 || q == 3) {
                            return b.urgency - a.urgency;
                        } else {
                            return b.importance - a.importance;
                        }
                    });
                });

                ['quadrant1Tasks', 'quadrant2Tasks', 'quadrant3Tasks', 'quadrant4Tasks'].forEach((elId, index) => {
                    const qNum = index + 1;
                    const tasks = quadrantTasks[qNum];
                    const container = this[elId];
                    const quadrantInfo = this.getQuadrantInfo(qNum);

                    if (tasks.length === 0) {
                        container.innerHTML = `
                            <div class="quadrant-empty">
                                <div class="quadrant-empty-icon">${quadrantInfo.icon}</div>
                                <h4>Нет задач в этом блоке</h4>
                                <p>Добавьте новую задачу и оцените её важность и срочность</p>
                            </div>
                        `;
                    } else {
                        container.innerHTML = tasks.map(task => `
                            <div class="matrix-task-item ${task.completed ? 'completed' : ''}">
                                <div class="matrix-task-name">${this.escapeHtml(task.name)}</div>
                                <div class="matrix-task-description">${this.escapeHtml(task.description)}</div>
                                <div class="matrix-task-meta">
                                    <div class="matrix-task-meta-item">
                                        <span></span>
                                        <span>Важность: ${task.importance}/5</span>
                                    </div>
                                    <div class="matrix-task-meta-item">
                                        <span></span>
                                        <span>Срочность: ${task.urgency}/5</span>
                                    </div>
                                    ${task.dateTime ? `
                                        <div class="matrix-task-meta-item">
                                            <span></span>
                                            <span>${this.formatDateTime(task.dateTime).formatted}</span>
                                        </div>
                                    ` : ''}
                                    <div class="matrix-task-meta-item">
                                        <span></span>
                                        <span>${this.getStatusLabel(task.status)}</span>
                                    </div>
                                </div>
                                <div class="matrix-task-actions">
                                    <button class="matrix-action-btn matrix-check-btn" onclick="app.toggleTask(${task.id})">
                                        ✓ Выполнить
                                    </button>
                                    <button class="matrix-action-btn matrix-delete-btn" onclick="app.deleteTask(${task.id})">
                                        
                                    </button>
                                </div>
                            </div>
                        `).join('');
                    }
                });
            }

            startDateTimeCheck() {
                setInterval(() => {
                    this.render();
                }, 60000);
            }

            escapeHtml(text) {
                if (!text) return '';
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }
        }

        
        const app = new ToDoApp();