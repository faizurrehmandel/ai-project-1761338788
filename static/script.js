// Project Manager Frontend Logic

// Global state
let currentProjects = [];

// DOM Elements
const createModal = document.getElementById('createModal');
const editModal = document.getElementById('editModal');
const createForm = document.getElementById('create-form');
const editForm = document.getElementById('edit-form');
const projectsTableBody = document.getElementById('projects-table-body');
const loadingMessage = document.getElementById('loading-message');
const emptyMessage = document.getElementById('empty-message');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    setupEventListeners();
});

function setupEventListeners() {
    createForm.addEventListener('submit', handleCreateProject);
    editForm.addEventListener('submit', handleEditProject);
}

// Project Loading
async function loadProjects() {
    showLoading(true);
    try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        
        if (data.success) {
            currentProjects = data.projects;
            updateProjectsTable();
            updateStats();
        } else {
            showNotification('Error loading projects', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to load projects', 'error');
    } finally {
        showLoading(false);
    }
}

function updateProjectsTable() {
    if (currentProjects.length === 0) {
        showEmptyState(true);
        return;
    }
    
    showEmptyState(false);
    projectsTableBody.innerHTML = currentProjects.map(project => `
        <tr>
            <td>${escapeHtml(project.name)}</td>
            <td>${escapeHtml(project.command)}</td>
            <td>
                <span class="status-badge status-${project.status.toLowerCase()}">
                    ${getStatusIcon(project.status)}
                    ${escapeHtml(project.status)}
                </span>
            </td>
            <td>${formatDate(project.created_at)}</td>
            <td>
                <div class="action-buttons">
                    ${project.github_url ? `
                        <a href="${project.github_url}" target="_blank" class="btn btn-secondary btn-sm">
                            <i class="fab fa-github"></i> View Code
                        </a>
                    ` : ''}
                    ${project.status === 'Completed' ? `
                        <button class="btn btn-primary btn-sm" onclick="openEditModal(${project.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    ` : ''}
                    <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateStats() {
    const total = currentProjects.length;
    const completed = currentProjects.filter(p => p.status === 'Completed').length;
    const failed = currentProjects.filter(p => p.status === 'Failed').length;
    
    document.getElementById('total-projects').textContent = total;
    document.getElementById('completed-projects').textContent = completed;
    document.getElementById('failed-projects').textContent = failed;
}

// Project Creation
function openCreateModal() {
    createModal.classList.add('show');
    document.getElementById('project-command').focus();
}

function closeCreateModal() {
    createModal.classList.remove('show');
    createForm.reset();
}

async function handleCreateProject(event) {
    event.preventDefault();
    
    const command = document.getElementById('project-command').value.trim();
    if (!command) return;
    
    const submitButton = createForm.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.btn-text');
    const buttonLoading = submitButton.querySelector('.btn-loading');
    
    try {
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'inline-flex';
        submitButton.disabled = true;
        
        const response = await fetch('/api/projects/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Project created successfully', 'success');
            closeCreateModal();
            loadProjects();
        } else {
            showNotification(data.error || 'Failed to create project', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to create project', 'error');
    } finally {
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        submitButton.disabled = false;
    }
}

// Project Editing
function openEditModal(projectId) {
    const project = currentProjects.find(p => p.id === projectId);
    if (!project) return;
    
    document.getElementById('edit-project-id').value = project.id;
    document.getElementById('edit-project-name').textContent = project.name;
    document.getElementById('edit-project-description').textContent = project.command;
    document.getElementById('edit-command').value = '';
    
    editModal.classList.add('show');
    document.getElementById('edit-command').focus();
}

function closeEditModal() {
    editModal.classList.remove('show');
    editForm.reset();
}

async function handleEditProject(event) {
    event.preventDefault();
    
    const projectId = document.getElementById('edit-project-id').value;
    const command = document.getElementById('edit-command').value.trim();
    if (!command) return;
    
    const submitButton = editForm.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.btn-text');
    const buttonLoading = submitButton.querySelector('.btn-loading');
    
    try {
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'inline-flex';
        submitButton.disabled = true;
        
        const response = await fetch(`/api/projects/${projectId}/edit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Project updated successfully', 'success');
            closeEditModal();
            loadProjects();
        } else {
            showNotification(data.error || 'Failed to update project', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to update project', 'error');
    } finally {
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        submitButton.disabled = false;
    }
}

// Project Deletion
async function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
        const response = await fetch(`/api/projects/${projectId}/delete`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Project deleted successfully', 'success');
            loadProjects();
        } else {
            showNotification(data.error || 'Failed to delete project', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to delete project', 'error');
    }
}

// UI Helpers
function showLoading(show) {
    loadingMessage.style.display = show ? 'block' : 'none';
    if (show) {
        projectsTableBody.innerHTML = '';
        emptyMessage.style.display = 'none';
    }
}

function showEmptyState(show) {
    emptyMessage.style.display = show ? 'block' : 'none';
    projectsTableBody.style.display = show ? 'none' : 'table-row-group';
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

function getStatusIcon(status) {
    const icons = {
        'Completed': '<i class="fas fa-check-circle"></i>',
        'Failed': '<i class="fas fa-exclamation-circle"></i>',
        'Generating': '<i class="fas fa-spinner fa-spin"></i>',
        'Editing': '<i class="fas fa-spinner fa-spin"></i>'
    };
    return icons[status] || '';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
