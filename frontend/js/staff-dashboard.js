// ============================================
// BU TRANSAKTO - Staff Dashboard Controller
// Handles all staff portal functionality
// ============================================

class StaffDashboard {
    static currentSection = 'dashboard';
    static currentFilter = 'all';
    static allRequests = [];
    static allStudents = [];
    static allFeedback = [];
    static notifications = [];
    static searchTimeout = null;

    /**
     * Initialize the staff dashboard
     */
    static async init() {
        // Check authentication
        if (!Auth.checkAuth(CONFIG.ROLES.STAFF)) return;

        // Load user info
        this.loadUserInfo();
        
        // Load all data
        await this.refreshAllData();

        // Setup event listeners
        this.setupSidebarNavigation();
        this.setupTopbarEvents();
        this.setupFilterButtons();
        this.setupSearchListeners();
        this.setupFormEvents();
        this.setupSettingsToggle();
        this.setupModalCloseButtons();
    }

    /**
     * Refresh all dashboard data
     */
    static async refreshAllData() {
        try {
            Utils.showLoading('Loading data...');
            
            await Promise.all([
                this.loadStats(),
                this.loadAllRequests(),
                this.loadStudents(),
                this.loadFeedback(),
                this.loadNotifications()
            ]);

            Utils.hideLoading();
        } catch (error) {
            Utils.hideLoading();
            console.error('Failed to refresh data:', error);
            Utils.showToast('Failed to load some data', 'error');
        }
    }

    /**
     * Load user information into UI
     */
    static loadUserInfo() {
        const user = api.getUserData();
        if (!user) return;

        const initial = (user.name || 'Staff').charAt(0).toUpperCase();

        this.setText('sidebarAvatar', initial);
        this.setText('sidebarName', user.name || 'Staff Admin');
        this.setText('sidebarRole', 'Staff');
        this.setText('topbarAvatar', initial);
        this.setText('topbarName', user.name || 'Staff Admin');
    }

    /**
     * Load dashboard statistics
     */
    static async loadStats() {
        try {
            const stats = await api.getStaffStats();
            
            this.setText('statTotalRequests', stats.totalRequests || 0);
            this.setText('statPending', stats.pendingRequests || 0);
            this.setText('statProcessing', stats.processingRequests || 0);
            this.setText('statCompleted', stats.completedRequests || 0);
            this.setText('statRejected', stats.rejectedRequests || 0);
            this.setText('statStudents', stats.totalStudents || 0);

            // Load recent requests
            this.loadRecentRequests(stats.recentRequests || []);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    /**
     * Load recent requests for dashboard
     */
    static loadRecentRequests(requests) {
        const container = document.getElementById('recentRequestsTable');
        if (!container) return;

        const recent = requests.slice(0, 5);

        if (recent.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h4>No requests yet</h4>
                    <p>No document requests have been submitted</p>
                </div>`;
            return;
        }

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Document</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${recent.map(r => this.renderRequestRow(r, true)).join('')}
                </tbody>
            </table>`;
    }

    /**
     * Load all requests
     */
    static async loadAllRequests() {
        try {
            this.allRequests = await api.getAllRequests();
            this.renderRequestsTable();
        } catch (error) {
            console.error('Failed to load requests:', error);
        }
    }

    /**
     * Render requests table with current filter
     */
    static renderRequestsTable() {
        const container = document.getElementById('allRequestsTable');
        if (!container) return;

        let filtered = this.allRequests;
        
        // Apply status filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(r => r.status === this.currentFilter);
        }

        // Apply search filter
        const searchTerm = document.getElementById('requestSearch')?.value?.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(r => 
                (r.studentName || '').toLowerCase().includes(searchTerm) ||
                (r.documentType || '').toLowerCase().includes(searchTerm) ||
                (r.studentNumber || '').toLowerCase().includes(searchTerm)
            );
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h4>No requests found</h4>
                    <p>${this.currentFilter === 'all' ? 'No requests submitted yet' : `No ${this.currentFilter} requests`}</p>
                </div>`;
            return;
        }

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Student #</th>
                        <th>Document</th>
                        <th>Purpose</th>
                        <th>Copies</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(r => this.renderFullRequestRow(r)).join('')}
                </tbody>
            </table>`;
    }

    /**
     * Load students list
     */
    static async loadStudents() {
        try {
            this.allStudents = await api.getAllStudents();
            this.renderStudentsTable();
        } catch (error) {
            console.error('Failed to load students:', error);
        }
    }

    /**
     * Render students table
     */
    static renderStudentsTable() {
        const container = document.getElementById('studentsTable');
        if (!container) return;

        let filtered = this.allStudents;
        const searchTerm = document.getElementById('studentSearch')?.value?.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(s =>
                (s.name || '').toLowerCase().includes(searchTerm) ||
                (s.studentId || '').toLowerCase().includes(searchTerm) ||
                (s.course || '').toLowerCase().includes(searchTerm) ||
                (s.email || '').toLowerCase().includes(searchTerm)
            );
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <h4>No students found</h4>
                </div>`;
            return;
        }

        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Student #</th>
                        <th>Course</th>
                        <th>Year Level</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th>Requests</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(s => this.renderStudentRow(s)).join('')}
                </tbody>
            </table>`;
    }

    /**
     * Load feedback
     */
    static async loadFeedback() {
        try {
            this.allFeedback = await api.getAllFeedback();
            
            // Stats
            const total = this.allFeedback.length;
            const avg = total > 0 
                ? (this.allFeedback.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1)
                : '0.0';
            
            this.setText('totalFeedback', total);
            this.setText('avgRating', avg);

            // Render table
            const container = document.getElementById('feedbackTable');
            if (!container) return;

            if (this.allFeedback.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">💬</div>
                        <h4>No feedback submitted yet</h4>
                    </div>`;
                return;
            }

            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Rating</th>
                            <th>Category</th>
                            <th>Message</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.allFeedback.map(f => this.renderFeedbackRow(f)).join('')}
                    </tbody>
                </table>`;
        } catch (error) {
            console.error('Failed to load feedback:', error);
        }
    }

    /**
     * Load notifications
     */
    static async loadNotifications() {
        try {
            this.notifications = await api.getNotifications();
            const unreadCount = this.notifications.filter(n => !n.read).length;

            // Update badges
            const sidebarBadge = document.getElementById('sidebarNotifBadge');
            const topbarBadge = document.getElementById('topbarNotifBadge');
            
            [sidebarBadge, topbarBadge].forEach(badge => {
                if (badge) {
                    if (unreadCount > 0) {
                        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                        badge.classList.remove('hidden');
                    } else {
                        badge.classList.add('hidden');
                    }
                }
            });

            // Render notifications list
            const container = document.getElementById('allNotificationsList');
            if (!container) return;

            if (this.notifications.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🔔</div>
                        <h4>No notifications</h4>
                    </div>`;
                return;
            }

            container.innerHTML = this.notifications.map(n => this.renderNotificationItem(n)).join('');
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    }

    /**
     * Update request status
     */
    static async updateRequestStatus(requestId, newStatus) {
        try {
            Utils.showLoading('Updating status...');
            await api.updateRequestStatus(requestId, newStatus);
            Utils.hideLoading();
            Utils.showToast(`Request status updated to ${newStatus}`, 'success');
            
            this.closeModal('updateStatusModal');
            await this.refreshAllData();
        } catch (error) {
            Utils.hideLoading();
            Utils.showToast(error.message || 'Failed to update status', 'error');
        }
    }

    /**
     * View request details
     */
    static viewRequestDetails(requestId) {
        const request = this.allRequests.find(r => r._id === requestId);
        if (!request) return;

        const status = Utils.getStatusColor(request.status);
        const body = document.getElementById('requestDetailsBody');
        
        body.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div class="info-item">
                    <label>Request ID</label>
                    <p>${request._id}</p>
                </div>
                <div class="info-item">
                    <label>Status</label>
                    <p><span class="status-badge status-${request.status}">${status.label}</span></p>
                </div>
                <div class="info-item">
                    <label>Student Name</label>
                    <p>${Utils.sanitize(request.studentName || request.studentId?.name || 'N/A')}</p>
                </div>
                <div class="info-item">
                    <label>Student Number</label>
                    <p>${Utils.sanitize(request.studentNumber || request.studentId?.studentId || 'N/A')}</p>
                </div>
                <div class="info-item">
                    <label>Document Type</label>
                    <p>${Utils.sanitize(request.documentType)}</p>
                </div>
                <div class="info-item">
                    <label>Purpose</label>
                    <p>${Utils.sanitize(request.purpose || 'N/A')}</p>
                </div>
                <div class="info-item">
                    <label>Copies</label>
                    <p>${request.copies || 1}</p>
                </div>
                <div class="info-item">
                    <label>Semester/Year</label>
                    <p>${Utils.sanitize(request.semesterYear || 'N/A')}</p>
                </div>
                <div class="info-item" style="grid-column:span 2;">
                    <label>Notes</label>
                    <p>${Utils.sanitize(request.notes || 'No notes')}</p>
                </div>
                <div class="info-item">
                    <label>Date Requested</label>
                    <p>${Utils.formatDate(request.dateRequested)}</p>
                </div>
                <div class="info-item">
                    <label>Date Processed</label>
                    <p>${request.dateProcessed ? Utils.formatDate(request.dateProcessed) : 'Not yet processed'}</p>
                </div>
            </div>
        `;

        document.getElementById('viewRequestModal').classList.remove('hidden');
    }

    /**
     * Open update status modal
     */
    static openUpdateStatusModal(requestId) {
        document.getElementById('updateRequestId').value = requestId;
        document.getElementById('updateStatusModal').classList.remove('hidden');
        
        // Set current status
        const request = this.allRequests.find(r => r._id === requestId);
        if (request) {
            document.getElementById('newStatus').value = request.status;
        }
    }

    /**
     * Navigate to section
     */
    static navigateTo(page) {
        this.currentSection = page;

        // Update sidebar
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
        if (activeNav) activeNav.classList.add('active');

        // Show section
        const sectionMap = {
            dashboard: 'dashboardSection',
            requests: 'requestsSection',
            students: 'studentsSection',
            feedback: 'feedbackSection',
            notifications: 'notificationsSection',
            settings: 'settingsSection'
        };

        document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));

        const sectionId = sectionMap[page];
        if (sectionId) {
            document.getElementById(sectionId).classList.remove('hidden');
        }

        // Update breadcrumb
        const titles = {
            dashboard: 'Dashboard',
            requests: 'All Requests',
            students: 'Students',
            feedback: 'Feedback',
            notifications: 'Notifications',
            settings: 'Settings'
        };
        this.setText('breadcrumbPage', titles[page] || page);

        // Load section data
        switch (page) {
            case 'requests': this.renderRequestsTable(); break;
            case 'students': this.renderStudentsTable(); break;
            case 'feedback': this.loadFeedback(); break;
            case 'notifications': this.loadNotifications(); break;
        }

        // Close mobile sidebar
        document.getElementById('staffSidebar')?.classList.remove('open');
    }

    // ==================== EVENT SETUP ====================

    static setupSidebarNavigation() {
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(item.dataset.page);
            });
        });

        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(link.dataset.page);
            });
        });
    }

    static setupTopbarEvents() {
        document.getElementById('sidebarToggle')?.addEventListener('click', () => {
            document.getElementById('staffSidebar').classList.toggle('open');
        });

        document.getElementById('refreshBtn')?.addEventListener('click', async () => {
            await this.refreshAllData();
            Utils.showToast('Data refreshed', 'info');
        });

        document.getElementById('notificationBtn')?.addEventListener('click', () => {
            this.navigateTo('notifications');
        });

        document.getElementById('clearAllNotifsBtn')?.addEventListener('click', async () => {
            try {
                await api.markAllNotificationsRead();
                await this.loadNotifications();
                Utils.showToast('All notifications marked as read', 'success');
            } catch (error) {
                Utils.showToast('Failed to update notifications', 'error');
            }
        });

        document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
            this.openChangePassword();
        });

        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            Auth.logout();
        });
    }

    static setupFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderRequestsTable();
            });
        });
    }

    static setupSearchListeners() {
        document.getElementById('requestSearch')?.addEventListener('input', Utils.debounce(() => {
            this.renderRequestsTable();
        }, 300));

        document.getElementById('studentSearch')?.addEventListener('input', Utils.debounce(() => {
            this.renderStudentsTable();
        }, 300));
    }

    static setupFormEvents() {
        document.getElementById('updateStatusForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const requestId = document.getElementById('updateRequestId').value;
            const newStatus = document.getElementById('newStatus').value;
            this.updateRequestStatus(requestId, newStatus);
        });
    }

    static setupSettingsToggle() {
        const darkToggle = document.getElementById('darkModeToggle');
        if (darkToggle) {
            if (localStorage.getItem('dark_mode') === 'true') {
                darkToggle.checked = true;
                document.body.classList.add('dark-mode');
            }
            darkToggle.addEventListener('change', function() {
                document.body.classList.toggle('dark-mode', this.checked);
                localStorage.setItem('dark_mode', this.checked);
            });
        }
    }

    static setupModalCloseButtons() {
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) this.classList.add('hidden');
            });
        });

        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal-overlay')?.classList.add('hidden');
            });
        });
    }

    // ==================== RENDER METHODS ====================

    static renderRequestRow(request, isRecent = false) {
        const status = Utils.getStatusColor(request.status);
        const studentName = request.studentName || request.studentId?.name || 'Unknown';
        
        return `
            <tr>
                <td><strong>${Utils.sanitize(studentName)}</strong></td>
                <td>${Utils.sanitize(request.documentType)}</td>
                <td>${Utils.formatDate(request.dateRequested, 'short')}</td>
                <td><span class="status-badge status-${request.status}">${status.label}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-info btn-xs" onclick="StaffDashboard.viewRequestDetails('${request._id}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-primary btn-xs" onclick="StaffDashboard.openUpdateStatusModal('${request._id}')" title="Update Status">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
    }

    static renderFullRequestRow(request) {
        const status = Utils.getStatusColor(request.status);
        const studentName = request.studentName || request.studentId?.name || 'Unknown';
        const studentNumber = request.studentNumber || request.studentId?.studentId || 'N/A';
        const shortId = request._id ? request._id.substring(request._id.length - 6) : 'N/A';

        return `
            <tr>
                <td><code>${shortId}</code></td>
                <td><strong>${Utils.sanitize(studentName)}</strong></td>
                <td>${Utils.sanitize(studentNumber)}</td>
                <td>${Utils.sanitize(request.documentType)}</td>
                <td>${Utils.sanitize(request.purpose || '-')}</td>
                <td>${request.copies || 1}</td>
                <td>${Utils.formatDate(request.dateRequested, 'short')}</td>
                <td><span class="status-badge status-${request.status}">${status.label}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-info btn-xs" onclick="StaffDashboard.viewRequestDetails('${request._id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-primary btn-xs" onclick="StaffDashboard.openUpdateStatusModal('${request._id}')" title="Update Status">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
    }

    static renderStudentRow(student) {
        const requestCount = this.allRequests.filter(r => 
            r.studentId === student._id || r.studentId?._id === student._id
        ).length;

        return `
            <tr>
                <td><strong>${Utils.sanitize(student.name || 'Unknown')}</strong></td>
                <td>${Utils.sanitize(student.studentId || 'N/A')}</td>
                <td>${Utils.sanitize(student.course || 'N/A')}</td>
                <td>${Utils.sanitize(student.yearLevel || 'N/A')}</td>
                <td>${Utils.sanitize(student.contactNumber || 'N/A')}</td>
                <td>${Utils.sanitize(student.email || 'N/A')}</td>
                <td><span class="status-badge status-pending">${requestCount} request(s)</span></td>
            </tr>`;
    }

    static renderFeedbackRow(feedback) {
        const stars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
        const studentName = feedback.user?.name || 'Anonymous';

        return `
            <tr>
                <td>${Utils.sanitize(studentName)}</td>
                <td style="color:var(--secondary);">${stars}</td>
                <td>${Utils.sanitize(feedback.category)}</td>
                <td>${Utils.sanitize(feedback.message || '-')}</td>
                <td>${Utils.formatDate(feedback.createdAt, 'short')}</td>
            </tr>`;
    }

    static renderNotificationItem(notification) {
        const iconMap = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle'
        };

        return `
            <div class="notification-item ${notification.read ? '' : 'unread'}">
                <div class="notif-icon ${notification.type || 'info'}">
                    <i class="fas ${iconMap[notification.type] || 'fa-bell'}"></i>
                </div>
                <div class="notif-content">
                    <div class="notif-title">${Utils.sanitize(notification.title)}</div>
                    <div class="notif-message">${Utils.sanitize(notification.message)}</div>
                    <div class="notif-time">${Utils.timeAgo(notification.createdAt)}</div>
                </div>
            </div>`;
    }

    // ==================== PASSWORD CHANGE ====================

    static openChangePassword() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'changePasswordModal';
        overlay.innerHTML = `
            <div class="modal" style="max-width:450px;">
                <div class="modal-header">
                    <h3><i class="fas fa-key"></i> Change Password</h3>
                    <button class="modal-close" onclick="document.getElementById('changePasswordModal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="changePasswordForm">
                        <div class="form-group">
                            <label>Current Password</label>
                            <input type="password" class="form-input" id="currentPassword" required>
                        </div>
                        <div class="form-group">
                            <label>New Password</label>
                            <input type="password" class="form-input" id="newPassword" required minlength="6">
                        </div>
                        <div class="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" class="form-input" id="confirmPassword" required minlength="6">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('changePasswordModal').remove()">Cancel</button>
                            <button type="submit" class="btn btn-primary btn-sm">Update Password</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector('#changePasswordForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await StaffDashboard.changePassword();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    static async changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            Utils.showToast('Please fill in all fields', 'warning');
            return;
        }
        if (newPassword.length < 6) {
            Utils.showToast('Password must be at least 6 characters', 'warning');
            return;
        }
        if (newPassword !== confirmPassword) {
            Utils.showToast('Passwords do not match', 'warning');
            return;
        }

        const user = api.getUserData();
        if (!user) return;

        try {
            Utils.showLoading('Changing password...');
            await api.changePassword(user._id, currentPassword, newPassword);
            Utils.hideLoading();
            document.getElementById('changePasswordModal')?.remove();
            Utils.showToast('Password changed! Please login again.', 'success');
            setTimeout(() => Auth.logout(), 2000);
        } catch (error) {
            Utils.hideLoading();
            Utils.showToast(error.message || 'Failed to change password', 'error');
        }
    }

    // ==================== HELPERS ====================

    static closeModal(modalId) {
        document.getElementById(modalId)?.classList.add('hidden');
    }

    static setText(elementId, text) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = text || '';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    StaffDashboard.init();
});

window.StaffDashboard = StaffDashboard;