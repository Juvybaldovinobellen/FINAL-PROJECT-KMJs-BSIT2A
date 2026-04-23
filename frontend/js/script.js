// ============================================
// PAGE NAVIGATION - USER SELECTION TO LOGIN
// ============================================

// Get the containers
const roleSelectionPage = document.getElementById('roleSelectionPage');
const signinContainer = document.getElementById('signinContainer');
const studentInfoContainer = document.getElementById('studentInfoContainer');
const homepage = document.getElementById('homepage');
const settingsPage = document.getElementById('settingsPage');

// Get role buttons
const studentRoleBtn = document.getElementById('studentRoleBtn');
const staffRoleBtn = document.getElementById('staffRoleBtn');

// Store selected role
let selectedRole = null;
let currentUserData = null;

// Global data
let allRequests = JSON.parse(localStorage.getItem('documentRequests')) || [];
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
let currentFilter = 'all';
let currentStaffFilter = 'all';

// Function to hide all main pages and page containers
function hideAllPages() {
    const mainPages = [roleSelectionPage, signinContainer, studentInfoContainer, homepage, settingsPage];
    mainPages.forEach(page => {
        if (page) page.style.display = 'none';
    });
    // Hide dynamic page containers
    const containers = ['requestDocumentPage', 'requestStatusPage', 'historyPage', 'notificationsPage', 'staffInterfacePage'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

// Show user selection (first page)
function showUserSelection() {
    hideAllPages();
    if (roleSelectionPage) roleSelectionPage.style.display = 'flex';
}

// Show login page
function showLoginPage() {
    hideAllPages();
    if (signinContainer) signinContainer.style.display = 'flex';
    const signinTitle = document.querySelector('#signinContainer .signin-title');
    if (signinTitle && selectedRole) {
        signinTitle.innerHTML = `Sign in as ${selectedRole === 'student' ? 'Student' : 'Staff'}`;
    }
}

// Show student info form (registration)
function showStudentInfoForm() {
    hideAllPages();
    if (studentInfoContainer) studentInfoContainer.style.display = 'flex';
}

// Show homepage (dashboard)
function showHomepage() {
    hideAllPages();
    if (homepage) homepage.style.display = 'flex';
    const dashboardContent = document.getElementById('dashboardContent');
    if (dashboardContent) dashboardContent.style.display = 'block';
    loadUserDataToHomepage();
    updateDashboardStats();
    if (selectedRole === 'staff') {
        loadStaffInterface();
    }
}

// Show settings page
function showSettingsPage() {
    hideAllPages();
    if (settingsPage) settingsPage.style.display = 'flex';
}

// Load user data into homepage/profile
function loadUserDataToHomepage() {
    const savedData = localStorage.getItem('studentData');
    if (savedData) {
        const userData = JSON.parse(savedData);
        currentUserData = userData;
        
        const userNameDisplay = document.getElementById('userNameDisplay');
        const welcomeName = document.getElementById('welcomeName');
        const profileName = document.getElementById('profileName');
        const profileStudentNumber = document.getElementById('profileStudentNumber');
        const profileCourse = document.getElementById('profileCourse');
        const profileYearBlock = document.getElementById('profileYearBlock');
        const profileContact = document.getElementById('profileContact');
        const profilePersonalEmail = document.getElementById('profilePersonalEmail');
        const profileAddress = document.getElementById('profileAddress');
        const profileAccountEmail = document.getElementById('profileAccountEmail');
        
        if (userNameDisplay) userNameDisplay.textContent = userData.fullName?.split(' ')[0] || 'User';
        if (welcomeName) welcomeName.textContent = userData.fullName?.split(' ')[0] || 'Student';
        if (profileName) profileName.textContent = userData.fullName || 'Student Name';
        if (profileStudentNumber) profileStudentNumber.textContent = userData.studentNumber || 'Student Number';
        if (profileCourse) profileCourse.textContent = userData.course || 'Course';
        if (profileYearBlock) profileYearBlock.textContent = userData.yearBlock || 'Year & Block';
        if (profileContact) profileContact.textContent = userData.contactNumber || 'Contact';
        if (profilePersonalEmail) profilePersonalEmail.textContent = userData.personalEmail || 'Personal Email';
        if (profileAddress) profileAddress.textContent = userData.address || 'Address';
        if (profileAccountEmail) profileAccountEmail.textContent = userData.accountEmail || 'Account Email';
        
        const avatarInitial = userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U';
        const avatarUrl = `https://ui-avatars.com/api/?background=f59e0b&color=fff&rounded=true&bold=true&size=40&name=${avatarInitial}`;
        const profileAvatar = document.getElementById('profileAvatar');
        const dropdownAvatar = document.getElementById('dropdownAvatar');
        if (profileAvatar) profileAvatar.src = avatarUrl;
        if (dropdownAvatar) dropdownAvatar.src = avatarUrl;
    }
}

// ============================================
// ROLE SELECTION HANDLERS
// ============================================
if (studentRoleBtn) {
    studentRoleBtn.addEventListener('click', () => {
        selectedRole = 'student';
        showLoginPage();
    });
}
if (staffRoleBtn) {
    staffRoleBtn.addEventListener('click', () => {
        selectedRole = 'staff';
        showLoginPage();
    });
}

// ============================================
// LOGIN FORM HANDLERS
// ============================================
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const forgotPassword = document.getElementById('forgotPassword');
const togglePassword = document.getElementById('togglePassword');

if (togglePassword) {
    togglePassword.addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}

if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        const savedData = localStorage.getItem('studentData');
        if (savedData) {
            const userData = JSON.parse(savedData);
            if (email === userData.accountEmail && password === userData.accountPassword) {
                alert('Login successful!');
                showHomepage();
            } else {
                alert('Invalid email or password.');
            }
        } else {
            alert('No registered account. Please register first.');
        }
    });
}

if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showStudentInfoForm();
    });
}

if (forgotPassword) {
    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Password reset link will be sent to your email');
    });
}

// ============================================
// STUDENT REGISTRATION
// ============================================
const studentInfoForm = document.getElementById('studentInfoForm');
const toggleFormPassword = document.getElementById('toggleFormPassword');

if (toggleFormPassword) {
    toggleFormPassword.addEventListener('click', function() {
        const pwd = document.getElementById('accountPassword');
        const type = pwd.getAttribute('type') === 'password' ? 'text' : 'password';
        pwd.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}

if (studentInfoForm) {
    studentInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const studentData = {
            fullName: document.getElementById('fullName')?.value,
            studentNumber: document.getElementById('studentNumber')?.value,
            course: document.getElementById('course')?.value,
            yearBlock: document.getElementById('yearBlock')?.value,
            contactNumber: document.getElementById('contactNumber')?.value,
            personalEmail: document.getElementById('personalEmail')?.value,
            address: document.getElementById('address')?.value,
            accountEmail: document.getElementById('accountEmail')?.value,
            accountPassword: document.getElementById('accountPassword')?.value
        };
        for (let key in studentData) {
            if (!studentData[key]) {
                alert('Please fill in all fields');
                return;
            }
        }
        if (studentData.accountPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(studentData.accountEmail) || !emailPattern.test(studentData.personalEmail)) {
            alert('Please enter valid email addresses');
            return;
        }
        localStorage.setItem('studentData', JSON.stringify(studentData));
        alert('Registration successful! Please login.');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        if (emailInput) emailInput.value = studentData.accountEmail;
        if (passwordInput) passwordInput.value = '';
        showLoginPage();
    });
}

// ============================================
// SETTINGS BACK BUTTON
// ============================================
const settingsBackBtn = document.getElementById('settingsBackBtn');
if (settingsBackBtn) {
    settingsBackBtn.addEventListener('click', () => {
        showHomepage();
    });
}

// Settings tabs
const settingsNavBtns = document.querySelectorAll('.settings-nav-btn');
if (settingsNavBtns.length) {
    settingsNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-settings-tab');
            document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.settings-nav-btn').forEach(nav => nav.classList.remove('active'));
            const targetTab = document.getElementById(`settings-${tabId}`);
            if (targetTab) targetTab.classList.add('active');
            btn.classList.add('active');
        });
    });
}

// Main navigation from settings
const settingsMainNavBtns = document.querySelectorAll('.settings-main-nav-btn');
if (settingsMainNavBtns.length) {
    settingsMainNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.getAttribute('data-nav-page');
            if (page === 'dashboard') showHomepage();
            else if (page === 'documents') {
                showPage('requestDocumentPage');
            } else if (page === 'requests') {
                showPage('requestStatusPage');
            } else if (page === 'history') {
                showPage('historyPage');
            } else if (page === 'notifications') {
                showPage('notificationsPage');
            }
        });
    });
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    selectedRole = null;
    currentUserData = null;
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    showUserSelection();
}
window.logout = logout;

// Placeholder functions for settings buttons
window.editProfileInfo = () => openProfileEditModal();
window.editContacts = () => openProfileEditModal();
window.viewHistory = () => showPage('historyPage');
window.changePassword = () => openChangePasswordModal();
window.viewLoginHistory = () => alert('Login history feature coming soon');
window.manageDevices = () => alert('Manage devices feature coming soon');
window.logoutAllDevices = () => { logout(); alert('Logged out from all devices'); };

// ============================================
// SIDEBAR TOGGLE AND NAVIGATION (UPDATED)
// ============================================
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}

// Function to show a specific page container (for student pages)
function showPage(pageId) {
    const dashboardContent = document.getElementById('dashboardContent');
    if (dashboardContent) dashboardContent.style.display = 'none';
    // Hide all page containers
    const pages = ['requestDocumentPage', 'requestStatusPage', 'historyPage', 'notificationsPage', 'staffInterfacePage'];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    const selected = document.getElementById(pageId);
    if (selected) selected.style.display = 'block';
    // Load data if needed
    if (pageId === 'requestStatusPage') loadRequestsTable();
    if (pageId === 'historyPage') loadHistoryPage();
    if (pageId === 'notificationsPage') loadNotificationsPage();
    if (pageId === 'requestDocumentPage') loadStudentInfoToForm();
}

// Update navigation items to use showPage
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    // Remove existing listeners by cloning
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);
    newItem.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        newItem.classList.add('active');
        const page = newItem.getAttribute('data-page');
        if (page === 'dashboard') {
            const dashboardContent = document.getElementById('dashboardContent');
            if (dashboardContent) dashboardContent.style.display = 'block';
            const containers = ['requestDocumentPage', 'requestStatusPage', 'historyPage', 'notificationsPage', 'staffInterfacePage'];
            containers.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
        } else if (page === 'Requestdocument') {
            showPage('requestDocumentPage');
        } else if (page === 'requestsDocumentStatus') {
            showPage('requestStatusPage');
        } else if (page === 'history') {
            showPage('historyPage');
        } else if (page === 'notifications') {
            showPage('notificationsPage');
        }
    });
});

// Profile dropdown
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');
if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => {
        profileDropdown.classList.remove('show');
    });
}

// Logout button in homepage
const logoutBtnHome = document.getElementById('logoutBtnHome');
if (logoutBtnHome) {
    logoutBtnHome.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

// ============================================
// DOCUMENT REQUEST (NEW FORM)
// ============================================
const reqDocType = document.getElementById('reqDocType');
const reqSpecifyGroup = document.getElementById('reqSpecifyDocumentGroup');
const reqSemesterGroup = document.getElementById('reqSemesterGroup');
const reqSpecifyDoc = document.getElementById('reqSpecifyDoc');
const reqSemester = document.getElementById('reqSemester');

if (reqDocType) {
    reqDocType.addEventListener('change', function() {
        if (this.value === 'Others') {
            if (reqSpecifyGroup) reqSpecifyGroup.classList.add('show');
            if (reqSpecifyDoc) reqSpecifyDoc.required = true;
        } else {
            if (reqSpecifyGroup) reqSpecifyGroup.classList.remove('show');
            if (reqSpecifyDoc) { reqSpecifyDoc.required = false; reqSpecifyDoc.value = ''; }
        }
        if (this.value === 'Certificate of Grades') {
            if (reqSemesterGroup) reqSemesterGroup.classList.add('show');
            if (reqSemester) reqSemester.required = true;
        } else {
            if (reqSemesterGroup) reqSemesterGroup.classList.remove('show');
            if (reqSemester) { reqSemester.required = false; reqSemester.value = ''; }
        }
    });
}

function loadStudentInfoToForm() {
    const savedData = localStorage.getItem('studentData');
    if (savedData) {
        const userData = JSON.parse(savedData);
        const fields = ['reqFullName', 'reqStudentNumber', 'reqCourse', 'reqYearBlock'];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = userData[id.replace('req', '').toLowerCase()] || '';
        });
    }
}

const documentRequestFormNew = document.getElementById('documentRequestFormNew');
if (documentRequestFormNew) {
    documentRequestFormNew.addEventListener('submit', function(e) {
        e.preventDefault();
        let docName = document.getElementById('reqDocType').value;
        if (docName === 'Others') docName = document.getElementById('reqSpecifyDoc').value;
        const semesterYear = document.getElementById('reqSemester')?.value || '';
        const newRequest = {
            id: Date.now(),
            fullName: document.getElementById('reqFullName').value,
            studentNumber: document.getElementById('reqStudentNumber').value,
            course: document.getElementById('reqCourse').value,
            yearBlock: document.getElementById('reqYearBlock').value,
            documentType: docName,
            semesterYear: semesterYear,
            purpose: document.getElementById('reqPurpose').value,
            copies: document.getElementById('reqQuantity').value,
            notes: document.getElementById('reqNotes').value,
            dateRequested: new Date().toLocaleString(),
            status: 'pending',
            dateUpdated: new Date().toLocaleString()
        };
        allRequests.push(newRequest);
        localStorage.setItem('documentRequests', JSON.stringify(allRequests));
        addNotification('Request Submitted', `Your request for ${docName} has been submitted.`, 'info');
        const successDiv = document.getElementById('reqSuccessMessage');
        if (successDiv) {
            successDiv.innerHTML = '✅ Request submitted successfully!';
            successDiv.style.display = 'block';
            setTimeout(() => successDiv.style.display = 'none', 5000);
        }
        documentRequestFormNew.reset();
        if (reqSpecifyGroup) reqSpecifyGroup.classList.remove('show');
        if (reqSemesterGroup) reqSemesterGroup.classList.remove('show');
        updateDashboardStats();
    });
}

// ============================================
// REQUEST STATUS PAGE
// ============================================
function loadRequestsTable() {
    const tbody = document.getElementById('requestsTableBody');
    if (!tbody) return;
    let filtered = allRequests;
    if (currentFilter !== 'all') filtered = allRequests.filter(r => r.status === currentFilter);
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No requests found</td></tr>';
        return;
    }
    tbody.innerHTML = filtered.map(r => `
        <tr>
            <td>${r.dateRequested}</td>
            <td>${r.documentType}</td>
            <td>${r.semesterYear || 'N/A'}</td>
            <td>${r.copies}</td>
            <td><span class="status-badge status-${r.status}">${r.status.toUpperCase()}</span></td>
            <td><button onclick="viewRequestDetails(${r.id})" class="status-filter-btn">View</button></td>
        </tr>
    `).join('');
}

const filterBtns = document.querySelectorAll('.status-filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        loadRequestsTable();
    });
});

window.viewRequestDetails = function(id) {
    const req = allRequests.find(r => r.id === id);
    if (req) alert(`Document: ${req.documentType}\nStatus: ${req.status}\nDate: ${req.dateRequested}\nPurpose: ${req.purpose}\nCopies: ${req.copies}`);
};

// ============================================
// HISTORY PAGE
// ============================================
function loadHistoryPage() {
    const timeline = document.getElementById('historyTimeline');
    if (!timeline) return;
    if (allRequests.length === 0) {
        timeline.innerHTML = '<div class="history-item"><div class="history-date">No transactions</div><div class="history-title">Your history will appear here</div></div>';
        return;
    }
    timeline.innerHTML = allRequests.slice().reverse().map(r => `
        <div class="history-item">
            <div class="history-date">${r.dateRequested}</div>
            <div class="history-title">${r.documentType} - ${r.status.toUpperCase()}</div>
            <div class="history-detail">Purpose: ${r.purpose} | Copies: ${r.copies}</div>
        </div>
    `).join('');
}

// ============================================
// NOTIFICATIONS PAGE
// ============================================
function loadNotificationsPage() {
    const container = document.getElementById('notificationsList');
    if (!container) return;
    if (notifications.length === 0) {
        container.innerHTML = '<div class="notification-item"><div class="notification-icon info"><i class="fas fa-info-circle"></i></div><div class="notification-content"><div class="notification-title">No notifications</div></div></div>';
        return;
    }
    container.innerHTML = notifications.slice().reverse().map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}">
            <div class="notification-icon ${n.type}"><i class="fas ${n.icon || 'fa-bell'}"></i></div>
            <div class="notification-content">
                <div class="notification-title">${n.title}</div>
                <div class="notification-message">${n.message}</div>
                <div class="notification-time">${n.time}</div>
            </div>
        </div>
    `).join('');
}

function addNotification(title, message, type = 'info') {
    const icons = { info: 'fa-info-circle', success: 'fa-check-circle', warning: 'fa-exclamation-triangle' };
    notifications.unshift({
        id: Date.now(),
        title, message, type,
        icon: icons[type] || 'fa-bell',
        time: new Date().toLocaleString(),
        read: false
    });
    if (notifications.length > 50) notifications.pop();
    localStorage.setItem('notifications', JSON.stringify(notifications));
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
        } else badge.style.display = 'none';
    }
}

// ============================================
// DASHBOARD STATS
// ============================================
function updateDashboardStats() {
    const total = allRequests.length;
    const pending = allRequests.filter(r => r.status === 'pending').length;
    const completed = allRequests.filter(r => r.status === 'completed').length;
    const statCards = document.querySelectorAll('.stat-card h3');
    if (statCards[0]) statCards[0].textContent = total;
    if (statCards[1]) statCards[1].textContent = pending;
    if (statCards[2]) statCards[2].textContent = completed;
}

// ============================================
// STAFF INTERFACE
// ============================================
function loadStaffInterface() {
    const total = allRequests.length;
    const pending = allRequests.filter(r => r.status === 'pending').length;
    const completed = allRequests.filter(r => r.status === 'completed').length;
    const totalEl = document.getElementById('staffTotalRequests');
    const pendingEl = document.getElementById('staffPendingRequests');
    const completedEl = document.getElementById('staffCompletedRequests');
    if (totalEl) totalEl.textContent = total;
    if (pendingEl) pendingEl.textContent = pending;
    if (completedEl) completedEl.textContent = completed;
    loadStaffRequestsTable();
}

function loadStaffRequestsTable() {
    const tbody = document.getElementById('staffRequestsTableBody');
    if (!tbody) return;
    let filtered = allRequests;
    if (currentStaffFilter !== 'all') filtered = allRequests.filter(r => r.status === currentStaffFilter);
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9">No requests found</td></tr>';
        return;
    }
    tbody.innerHTML = filtered.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.fullName}</td>
            <td>${r.studentNumber}</td>
            <td>${r.documentType}</td>
            <td>${r.semesterYear || 'N/A'}</td>
            <td>${r.purpose}</td>
            <td>${r.dateRequested}</td>
            <td><span class="status-badge status-${r.status}">${r.status.toUpperCase()}</span></td>
            <td class="action-buttons">
                <button onclick="updateRequestStatus(${r.id}, 'approved')" style="background:#16a34a;color:white;">Approve</button>
                <button onclick="updateRequestStatus(${r.id}, 'completed')" style="background:#0284c7;color:white;">Complete</button>
                <button onclick="updateRequestStatus(${r.id}, 'rejected')" style="background:#dc2626;color:white;">Reject</button>
            </td>
        </tr>
    `).join('');
}

window.filterStaffRequests = function(filter) {
    currentStaffFilter = filter;
    loadStaffRequestsTable();
};

window.updateRequestStatus = function(id, newStatus) {
    const req = allRequests.find(r => r.id === id);
    if (req) {
        req.status = newStatus;
        req.dateUpdated = new Date().toLocaleString();
        localStorage.setItem('documentRequests', JSON.stringify(allRequests));
        let msg = '';
        if (newStatus === 'approved') msg = 'approved and being processed';
        else if (newStatus === 'completed') msg = 'completed and ready';
        else msg = 'rejected';
        addNotification(`Request ${newStatus}`, `Your ${req.documentType} request has been ${msg}.`, newStatus === 'rejected' ? 'warning' : 'success');
        alert(`Request #${id} marked as ${newStatus}`);
        loadStaffRequestsTable();
        loadRequestsTable();
        updateDashboardStats();
        loadHistoryPage();
    }
};

// ============================================
// PROFILE EDIT MODAL (if modals exist in HTML)
// ============================================
function openProfileEditModal() {
    const modal = document.getElementById('profileEditModal');
    if (!modal) {
        alert('Profile edit modal not found. Please add the modal HTML.');
        return;
    }
    const savedData = localStorage.getItem('studentData');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('editFullName').value = data.fullName || '';
        document.getElementById('editStudentNumber').value = data.studentNumber || '';
        document.getElementById('editCourse').value = data.course || '';
        document.getElementById('editYearBlock').value = data.yearBlock || '';
        document.getElementById('editContactNumber').value = data.contactNumber || '';
        document.getElementById('editPersonalEmail').value = data.personalEmail || '';
        document.getElementById('editAddress').value = data.address || '';
        document.getElementById('editAccountEmail').value = data.accountEmail || '';
        document.getElementById('editNewPassword').value = '';
        document.getElementById('editConfirmPassword').value = '';
    }
    modal.style.display = 'block';
}

function openChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (!modal) {
        alert('Change password modal not found. Please add the modal HTML.');
        return;
    }
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
    modal.style.display = 'block';
}

function closeProfileEditModal() {
    const modal = document.getElementById('profileEditModal');
    if (modal) modal.style.display = 'none';
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.style.display = 'none';
}

// Event listeners for modals (if elements exist)
const profileEditForm = document.getElementById('profileEditForm');
if (profileEditForm) {
    profileEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('editNewPassword').value;
        const confirm = document.getElementById('editConfirmPassword').value;
        if (newPassword && newPassword !== confirm) {
            alert('Passwords do not match');
            return;
        }
        if (newPassword && newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        const savedData = localStorage.getItem('studentData');
        let userData = savedData ? JSON.parse(savedData) : {};
        userData.fullName = document.getElementById('editFullName').value;
        userData.studentNumber = document.getElementById('editStudentNumber').value;
        userData.course = document.getElementById('editCourse').value;
        userData.yearBlock = document.getElementById('editYearBlock').value;
        userData.contactNumber = document.getElementById('editContactNumber').value;
        userData.personalEmail = document.getElementById('editPersonalEmail').value;
        userData.address = document.getElementById('editAddress').value;
        userData.accountEmail = document.getElementById('editAccountEmail').value;
        if (newPassword) userData.accountPassword = newPassword;
        localStorage.setItem('studentData', JSON.stringify(userData));
        loadUserDataToHomepage();
        addNotification('Profile Updated', 'Your profile has been updated successfully.', 'success');
        closeProfileEditModal();
        alert('Profile updated!');
    });
}

const changePasswordForm = document.getElementById('changePasswordForm');
if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const current = document.getElementById('currentPassword').value;
        const newPwd = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmNewPassword').value;
        const savedData = localStorage.getItem('studentData');
        if (!savedData) return alert('No user data');
        const userData = JSON.parse(savedData);
        if (userData.accountPassword !== current) {
            alert('Current password is incorrect');
            return;
        }
        if (newPwd.length < 6) {
            alert('New password must be at least 6 characters');
            return;
        }
        if (newPwd !== confirm) {
            alert('New passwords do not match');
            return;
        }
        userData.accountPassword = newPwd;
        localStorage.setItem('studentData', JSON.stringify(userData));
        addNotification('Password Changed', 'Your password has been changed.', 'success');
        closeChangePasswordModal();
        alert('Password changed. Please login again.');
        logout();
    });
}

// Close modals when clicking outside or on X
window.onclick = function(e) {
    const editModal = document.getElementById('profileEditModal');
    const pwdModal = document.getElementById('changePasswordModal');
    if (e.target === editModal) closeProfileEditModal();
    if (e.target === pwdModal) closeChangePasswordModal();
};
document.querySelectorAll('.modal-close, .modal-close-password').forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
        closeProfileEditModal();
        closeChangePasswordModal();
    });
});
const cancelEdit = document.getElementById('cancelEditBtn');
if (cancelEdit) cancelEdit.addEventListener('click', closeProfileEditModal);
const cancelPwd = document.getElementById('cancelPasswordBtn');
if (cancelPwd) cancelPwd.addEventListener('click', closeChangePasswordModal);

// Password toggle inside edit modal
const toggleEditPwd = document.getElementById('toggleEditPassword');
if (toggleEditPwd) {
    toggleEditPwd.addEventListener('click', () => {
        const pwd = document.getElementById('editNewPassword');
        const type = pwd.getAttribute('type') === 'password' ? 'text' : 'password';
        pwd.setAttribute('type', type);
        toggleEditPwd.classList.toggle('fa-eye');
        toggleEditPwd.classList.toggle('fa-eye-slash');
    });
}

// ============================================
// INITIAL PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (roleSelectionPage) roleSelectionPage.style.display = 'flex';
    if (signinContainer) signinContainer.style.display = 'none';
    if (studentInfoContainer) studentInfoContainer.style.display = 'none';
    if (homepage) homepage.style.display = 'none';
    if (settingsPage) settingsPage.style.display = 'none';
    const containers = ['requestDocumentPage', 'requestStatusPage', 'historyPage', 'notificationsPage', 'staffInterfacePage'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    updateDashboardStats();
    
    // ========== FIX ROLE BUTTON CLICKS ==========
document.getElementById('studentRoleBtn')?.addEventListener('click', () => selectRole('student'));
document.getElementById('staffRoleBtn')?.addEventListener('click', () => selectRole('staff'));
});