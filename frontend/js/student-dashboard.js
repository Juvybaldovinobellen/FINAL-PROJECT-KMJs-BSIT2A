// ============================================
// BU TRANSAKTO - Student Dashboard Controller
// Handles all student dashboard functionality
// ============================================

class StudentDashboard {
    static currentSection = 'dashboard';
    static currentFilter = 'all';
    static requests = [];
    static notifications = [];

    /**
     * Initialize the student dashboard
     */
    static async init() {
        // Check authentication
        if (!Auth.checkAuth(CONFIG.ROLES.STUDENT)) return;

        // Load initial data
        this.loadUserInfo();
        await this.refreshAllData();

        // Setup event listeners
        this.setupSidebarNavigation();
        this.setupTopbarEvents();
        this.setupFormEvents();
        this.setupFilterButtons();
        this.setupStarRating();
        this.setupSettingsToggle();
        this.setupLogout();
        this.setupModalCloseButtons();
    }

    /**
     * Refresh all dashboard data
     */
    static async refreshAllData() {
        try {
            await Promise.all([
                this.loadStats(),
                this.loadNotifications()
            ]);
        } catch (error) {
            console.error('Failed to refresh data:', error);
        }
    }

    /**
     * Load user information into UI elements
     */
    static loadUserInfo() {
        const user = api.getUserData();
        if (!user) return;

        const firstName = (user.name || 'Student').split(' ')[0];
        const initial = firstName.charAt(0).toUpperCase();

        // Sidebar user info
        this.setText('sidebarAvatar', initial);
        this.setText('sidebarName', user.name || 'Student');
        this.setText('sidebarRole', 'Student');

        // Topbar user info
        this.setText('topbarAvatar', initial);
        this.setText('topbarName', user.name || 'Student');

        // Welcome message
        this.setText('welcomeName', firstName);

        // Profile section
        this.setText('profileAvatarLarge', initial);
        this.setText('profileFullName', user.name || 'Student');
        this.setText('profileStudentId', user.studentId || 'N/A');
    }

    /**
     * Load dashboard statistics
     */
    static async loadStats() {
        try {
            this.requests = await api.getMyRequests();

            const total = this.requests.length;
            const pending = this.requests.filter(r => r.status === 'pending').length;
            const processing = this.requests.filter(r => r.status === 'processing').length;
            const completed = this.requests.filter(r => r.status === 'completed').length;

            this.setText('totalRequests', total);
            this.setText('pendingRequests', pending);
            this.setText('processingRequests', processing);
            this.setText('completedRequests', completed);

            // Also update recent requests on dashboard
            this.loadRecentRequests();
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    /**
     * Load recent requests for dashboard card
     */
    static loadRecentRequests() {
        const recent = this.requests.slice(0, 5);
        const container = document.getElementById('recentRequestsTable');

        if (!container) return;

        if (recent.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📄</div>
                    <h4>No requests yet</h4>
                    <p>Start by submitting your first document request</p>
                </div>`;
            return;
        }

        container.innerHTML = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Purpose</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recent.map(r => this.renderRequestRow(r)).join('')}
                    </tbody>
                </table>
            </div>`;
    }

    /**
     * Load my requests for the requests page
     */
    static loadMyRequests() {
        let filtered = this.requests;
        if (this.currentFilter !== 'all') {
            filtered = this.requests.filter(r => r.status === this.currentFilter);
        }

        const container = document.getElementById('myRequestsTable');
        if (!container) return;

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h4>No requests found</h4>
                    <p>${this.currentFilter === 'all' ? 'Submit a request to get started' : `No ${this.currentFilter} requests`}</p>
                </div>`;
            return;
        }

        container.innerHTML = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Purpose</th>
                            <th>Copies</th>
                            <th>Date Requested</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filtered.map(r => this.renderFullRequestRow(r)).join('')}
                    </tbody>
                </table>
            </div>`;
    }

    /**
     * Load transaction history
     */
    static loadHistory() {
        const history = this.requests.filter(r => 
            r.status === 'completed' || r.status === 'rejected'
        );

        const container = document.getElementById('historyTable');
        if (!container) return;

        if (history.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🕒</div>
                    <h4>No transaction history</h4>
                    <p>Completed and rejected requests will appear here</p>
                </div>`;
            return;
        }

        container.innerHTML = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Purpose</th>
                            <th>Date Requested</th>
                            <th>Date Processed</th>
                            <th>Final Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${history.map(r => this.renderHistoryRow(r)).join('')}
                    </tbody>
                </table>
            </div>`;
    }

    /**
     * Load profile details
     */
    static loadProfileDetails() {
        const user = api.getUserData();
        if (!user) return;

        const container = document.getElementById('profileDetails');
        if (!container) return;

        const details = [
            { label: 'Full Name', value: user.name },
            { label: 'Student Number', value: user.studentId },
            { label: 'Course/Program', value: user.course },
            { label: 'Year Level', value: user.yearLevel },
            { label: 'Contact Number', value: user.contactNumber },
            { label: 'Email Address', value: user.email },
            { label: 'Complete Address', value: user.address }
        ];

        container.innerHTML = details.map(d => `
            <div class="info-item">
                <label>${d.label}</label>
                <p>${Utils.sanitize(d.value || 'Not provided')}</p>
            </div>
        `).join('');

        // Pre-fill edit form
        this.setText('editName', user.name);
        this.setText('editStudentId', user.studentId);
        this.setText('editCourse', user.course);
        this.setText('editYearLevel', user.yearLevel);
        this.setText('editContact', user.contactNumber);
        this.setText('editEmail', user.email);
        this.setText('editAddress', user.address);
    }

    /**
     * Load notifications
     */
    static async loadNotifications() {
        try {
            this.notifications = await api.getNotifications();
            const unreadCount = this.notifications.filter(n => !n.read).length;

            // Update badge
            const badge = document.getElementById('notifBadge');
            if (badge) {
                if (unreadCount > 0) {
                    badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }

            // Update notification panel
            const container = document.getElementById('notificationList');
            if (!container) return;

            if (this.notifications.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🔔</div>
                        <h4>No notifications</h4>
                    </div>`;
                return;
            }

            container.innerHTML = this.notifications.map(n => this.renderNotification(n)).join('');
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    }

    /**
     * Mark single notification as read
     */
    static async markNotificationRead(id) {
        try {
            await api.markNotificationRead(id);
            await this.loadNotifications();
        } catch (error) {
            console.error('Failed to mark notification:', error);
        }
    }

    /**
     * Navigate to a section
     */
    static navigateTo(page) {
        this.currentSection = page;

        // Update sidebar active state
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
        if (activeNav) activeNav.classList.add('active');

        // Show/hide sections
        const sectionMap = {
            dashboard: 'dashboardSection',
            request: 'requestSection',
            myrequests: 'myRequestsSection',
            history: 'historySection',
            profile: 'profileSection',
            settings: 'settingsSection',
            feedback: 'feedbackSection'
        };

        document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));

        const sectionId = sectionMap[page];
        if (sectionId) {
            const section = document.getElementById(sectionId);
            if (section) section.classList.remove('hidden');
        }

        // Update breadcrumb
        const titles = {
            dashboard: 'Dashboard',
            request: 'New Request',
            myrequests: 'My Requests',
            history: 'Transaction History',
            profile: 'My Profile',
            settings: 'Settings',
            feedback: 'Feedback'
        };
        this.setText('breadcrumbPage', titles[page] || page);

        // Load section-specific data
        switch (page) {
            case 'myrequests':
                this.loadMyRequests();
                break;
            case 'history':
                this.loadHistory();
                break;
            case 'profile':
                this.loadProfileDetails();
                break;
        }

        // Close mobile sidebar
        document.getElementById('sidebar')?.classList.remove('open');
        // Close notification panel
        document.getElementById('notificationPanel')?.classList.remove('open');
    }

    /**
     * Submit a new document request
     */
    static async submitRequest() {
        let docType = document.getElementById('docType').value;
        
        if (!docType) {
            Utils.showToast('Please select a document type', 'warning');
            return;
        }

        if (docType === 'Others') {
            docType = document.getElementById('specifyDoc')?.value?.trim();
            if (!docType) {
                Utils.showToast('Please specify the document name', 'warning');
                return;
            }
        }

        const purpose = document.getElementById('purpose').value;
        if (!purpose) {
            Utils.showToast('Please select a purpose', 'warning');
            return;
        }

        const requestData = {
            documentType: docType,
            purpose: purpose,
            notes: document.getElementById('notes')?.value?.trim() || '',
            semesterYear: document.getElementById('semesterYear')?.value?.trim() || '',
            copies: parseInt(document.getElementById('copies')?.value) || 1
        };

        try {
            Utils.showLoading('Submitting request...');
            await api.createRequest(requestData);
            Utils.hideLoading();
            Utils.showToast('Request submitted successfully!', 'success');

            // Reset form
            document.getElementById('requestForm').reset();
            document.getElementById('specifyDocGroup')?.classList.add('hidden');

            // Refresh data
            await this.refreshAllData();
            this.loadRecentRequests();
            this.navigateTo('myrequests');
            this.loadMyRequests();
        } catch (error) {
            Utils.hideLoading();
            Utils.showToast(error.message || 'Failed to submit request', 'error');
        }
    }

    /**
     * Submit feedback
     */
    static async submitFeedback() {
        const ratingInput = document.getElementById('starRating');
        const rating = parseInt(ratingInput?.dataset?.rating || '0');
        
        if (!rating || rating < 1) {
            Utils.showToast('Please select a rating', 'warning');
            return;
        }

        const category = document.getElementById('feedbackCategory').value;
        if (!category) {
            Utils.showToast('Please select a category', 'warning');
            return;
        }

        try {
            Utils.showLoading('Submitting feedback...');
            await api.submitFeedback({
                rating,
                category,
                message: document.getElementById('feedbackMessage')?.value?.trim() || '',
                emoji: ''
            });
            Utils.hideLoading();
            Utils.showToast('Thank you for your feedback!', 'success');

            // Reset form
            document.getElementById('feedbackForm').reset();
            document.querySelectorAll('#starRating .star').forEach(s => s.classList.remove('active'));
            ratingInput.dataset.rating = '0';
        } catch (error) {
            Utils.hideLoading();
            Utils.showToast(error.message || 'Failed to submit feedback', 'error');
        }
    }

    /**
     * Open edit profile modal
     */
    static openEditProfile() {
        this.loadProfileDetails();
        document.getElementById('editProfileModal')?.classList.remove('hidden');
    }

    /**
     * Save profile changes
     */
    static async saveProfile() {
        const user = api.getUserData();
        if (!user) return;

        const updatedData = {
            name: document.getElementById('editName')?.value,
            studentId: document.getElementById('editStudentId')?.value,
            course: document.getElementById('editCourse')?.value,
            yearLevel: document.getElementById('editYearLevel')?.value,
            contactNumber: document.getElementById('editContact')?.value,
            email: document.getElementById('editEmail')?.value,
            address: document.getElementById('editAddress')?.value
        };

        try {
            Utils.showLoading('Updating profile...');
            await api.updateProfile(user._id, updatedData);
            // Update local storage
            api.saveUserData({ ...user, ...updatedData });
            Utils.hideLoading();
            this.closeModal('editProfileModal');
            this.loadUserInfo();
            this.loadProfileDetails();
            Utils.showToast('Profile updated successfully!', 'success');
        } catch (error) {
            Utils.hideLoading();
            Utils.showToast(error.message || 'Failed to update profile', 'error');
        }
    }

    /**
     * Open change password modal
     */
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
            await StudentDashboard.changePassword();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    /**
     * Change password
     */
    static async changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            Utils.showToast('Please fill in all fields', 'warning');
            return;
        }

        if (newPassword.length < 6) {
            Utils.showToast('New password must be at least 6 characters', 'warning');
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
            Utils.showToast('Password changed successfully! Please login again.', 'success');
            
            setTimeout(() => {
                Auth.logout();
            }, 2000);
        } catch (error) {
            Utils.hideLoading();
            Utils.showToast(error.message || 'Failed to change password', 'error');
        }
    }

    /**
     * Close a modal by ID
     */
    static closeModal(modalId) {
        document.getElementById(modalId)?.classList.add('hidden');
    }

    /**
     * Setup logout button
     */
    static setupLogout() {
        // Sidebar logout button (class="logout-btn")
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                api.logout();
                window.location.href = '../../index.html';
            });
        });
        
        // Settings page logout button (id="logoutBtn")
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                api.logout();
                window.location.href = '../../index.html';
            });
        }
    }

    // ==================== EVENT SETUP METHODS ====================

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
            document.getElementById('sidebar').classList.toggle('open');
        });

        document.getElementById('notificationBtn')?.addEventListener('click', () => {
            const panel = document.getElementById('notificationPanel');
            panel.classList.toggle('open');
        });

        document.getElementById('markAllReadBtn')?.addEventListener('click', async () => {
            try {
                await api.markAllNotificationsRead();
                await this.loadNotifications();
                Utils.showToast('All notifications marked as read', 'success');
            } catch (error) {
                Utils.showToast('Failed to update notifications', 'error');
            }
        });

        // Close panels on outside click
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('notificationPanel');
            if (panel && panel.classList.contains('open')) {
                if (!panel.contains(e.target) && e.target.id !== 'notificationBtn' && !document.getElementById('notificationBtn')?.contains(e.target)) {
                    panel.classList.remove('open');
                }
            }
        });
    }

    static setupFormEvents() {
        // Request form
        document.getElementById('requestForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitRequest();
        });

        // Document type change - show/hide "specify" field
        document.getElementById('docType')?.addEventListener('change', function() {
            const specifyGroup = document.getElementById('specifyDocGroup');
            if (this.value === 'Others') {
                specifyGroup?.classList.remove('hidden');
            } else {
                specifyGroup?.classList.add('hidden');
            }
        });

        // Feedback form
        document.getElementById('feedbackForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitFeedback();
        });

        // Edit profile form
        document.getElementById('editProfileForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveProfile();
        });

        // Populate dropdowns
        this.populateDropdowns();
    }

    static setupFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.loadMyRequests();
            });
        });
    }

    static setupStarRating() {
        const starContainer = document.getElementById('starRating');
        if (!starContainer) return;

        const stars = starContainer.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.dataset.value);
                stars.forEach((s, i) => {
                    s.classList.toggle('active', i < value);
                });
                starContainer.dataset.rating = value;
            });

            star.addEventListener('mouseenter', function() {
                const value = parseInt(this.dataset.value);
                stars.forEach((s, i) => {
                    s.classList.toggle('hover', i < value);
                });
            });
        });

        starContainer.addEventListener('mouseleave', () => {
            const currentRating = parseInt(starContainer.dataset.rating || '0');
            stars.forEach((s, i) => {
                s.classList.remove('hover');
                s.classList.toggle('active', i < currentRating);
            });
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
                if (e.target === this) {
                    this.classList.add('hidden');
                }
            });
        });

        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal-overlay')?.classList.add('hidden');
            });
        });
    }

    // ==================== RENDER METHODS ====================

    static renderRequestRow(request) {
        const status = Utils.getStatusColor(request.status);
        return `
            <tr>
                <td><strong>${Utils.sanitize(request.documentType)}</strong></td>
                <td>${Utils.sanitize(request.purpose || '-')}</td>
                <td>${Utils.formatDate(request.dateRequested, 'short')}</td>
                <td><span class="status-badge status-${request.status}">${status.label}</span></td>
            </tr>`;
    }

    static renderFullRequestRow(request) {
        const status = Utils.getStatusColor(request.status);
        return `
            <tr>
                <td><strong>${Utils.sanitize(request.documentType)}</strong></td>
                <td>${Utils.sanitize(request.purpose || '-')}</td>
                <td>${request.copies || 1}</td>
                <td>${Utils.formatDate(request.dateRequested, 'short')}</td>
                <td><span class="status-badge status-${request.status}">${status.label}</span></td>
            </tr>`;
    }

    static renderHistoryRow(request) {
        const status = Utils.getStatusColor(request.status);
        return `
            <tr>
                <td><strong>${Utils.sanitize(request.documentType)}</strong></td>
                <td>${Utils.sanitize(request.purpose || '-')}</td>
                <td>${Utils.formatDate(request.dateRequested, 'short')}</td>
                <td>${request.dateProcessed ? Utils.formatDate(request.dateProcessed, 'short') : 'N/A'}</td>
                <td><span class="status-badge status-${request.status}">${status.label}</span></td>
            </tr>`;
    }

    static renderNotification(notification) {
        const iconMap = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle'
        };

        return `
            <div class="notification-item ${notification.read ? '' : 'unread'}" 
                 onclick="StudentDashboard.markNotificationRead('${notification._id}')">
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

    static populateDropdowns() {
        const docTypeSelect = document.getElementById('docType');
        if (docTypeSelect && docTypeSelect.options.length <= 1) {
            CONFIG.DOCUMENT_TYPES.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                docTypeSelect.appendChild(option);
            });
        }

        const purposeSelect = document.getElementById('purpose');
        if (purposeSelect && purposeSelect.options.length <= 1) {
            CONFIG.PURPOSES.forEach(p => {
                const option = document.createElement('option');
                option.value = p;
                option.textContent = p;
                purposeSelect.appendChild(option);
            });
        }
    }

    // ==================== HELPER METHODS ====================
     
    /**
     * Safely set text content of an element
     */
    static setText(elementId, text) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = text || '';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    StudentDashboard.init();
});

// Expose to global scope
window.StudentDashboard = StudentDashboard;