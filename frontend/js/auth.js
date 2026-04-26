// ============================================
// BU TRANSAKTO - Authentication Module
// ============================================

class Auth {
    static currentRole = null;

    /**
     * Get correct path to index.html based on current location
     */
    static getIndexPath() {
        const path = window.location.pathname;
        
        // If in pages/student/ or pages/staff/ → go up 2 levels
        if (path.includes('/pages/student/') || path.includes('/pages/staff/')) {
            return '../../index.html';
        }
        
        // If in pages/ → go up 1 level
        if (path.includes('/pages/')) {
            return '../index.html';
        }
        
        // If already in root
        return 'index.html';
    }

    /**
     * Initialize auth event listeners
     */
    static init() {
        // ========== LANDING PAGE BUTTONS ==========
        
        document.getElementById('studentRoleBtn')?.addEventListener('click', () => {
            Auth.currentRole = CONFIG.ROLES.STUDENT;
            Auth.showPage('authPage');
            document.getElementById('authTitle').textContent = 'Student Login';
            document.getElementById('authSubtitle').textContent = 'Sign in to your student account';
        });

        document.getElementById('staffRoleBtn')?.addEventListener('click', () => {
            Auth.currentRole = CONFIG.ROLES.STAFF;
            Auth.showPage('authPage');
            document.getElementById('authTitle').textContent = 'Staff Login';
            document.getElementById('authSubtitle').textContent = 'Sign in to the staff portal';
        });

        document.getElementById('registerBtn')?.addEventListener('click', () => {
            Auth.showPage('registerPage');
        });

        // ========== AUTH PAGE (LOGIN) ==========
        
        document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await Auth.login();
        });

        document.getElementById('backToRoleBtn')?.addEventListener('click', () => {
            Auth.showPage('landingPage');
        });

        document.getElementById('showRegisterBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (Auth.currentRole === CONFIG.ROLES.STAFF) {
                Auth.showPage('staffRegisterPage');
            } else {
                Auth.showPage('registerPage');
            }
        });

        // ========== STUDENT REGISTER PAGE ==========
        
        document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await Auth.registerStudent();
        });

        document.getElementById('showLoginBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.showPage('authPage');
        });

        // ========== STAFF REGISTER PAGE ==========
        
        document.getElementById('staffRegisterForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await Auth.registerStaff();
        });

        document.getElementById('backToStaffLoginBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.showPage('authPage');
        });

        // ========== PASSWORD TOGGLES ==========
        document.querySelectorAll('.password-toggle').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });
    }

    static showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
        const page = document.getElementById(pageId);
        if (page) page.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    static async login() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            Utils.showToast('Please fill in all fields', 'warning');
            return;
        }

        try {
            Utils.showLoading('Signing in...');
            const data = await api.login(email, password);
            
            if (data.role !== Auth.currentRole) {
                throw new Error(`Invalid credentials for ${Auth.currentRole} account`);
            }

            Utils.hideLoading();
            Utils.showToast('Login successful!', 'success');

            setTimeout(() => {
                if (data.role === CONFIG.ROLES.STUDENT) {
                    window.location.href = 'pages/student/dashboard.html';
                } else {
                    window.location.href = 'pages/staff/dashboard.html';
                }
            }, 1000);

        } catch (error) {
            Utils.hideLoading();
            Utils.showToast(error.message || 'Login failed', 'error');
        }
    }

    static async registerStudent() {
        const fullName = document.getElementById('regFullName').value.trim();
        const studentId = document.getElementById('regStudentId').value.trim();
        const course = document.getElementById('regCourse').value.trim();
        const yearLevel = document.getElementById('regYearLevel').value.trim();
        const contactNumber = document.getElementById('regContact').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;

        if (!fullName || !studentId || !course || !yearLevel || !email || !password) {
            Utils.showToast('Please fill in all required fields', 'warning');
            return;
        }
        if (password.length < 6) {
            Utils.showToast('Password must be at least 6 characters', 'warning');
            return;
        }

        const formData = {
            name: fullName, email, password,
            role: CONFIG.ROLES.STUDENT,
            studentId, course, yearLevel,
            contactNumber: contactNumber || '',
            address: document.getElementById('regAddress').value.trim() || ''
        };

        try {
            Utils.showLoading('Creating student account...');
            await api.register(formData);
            Utils.hideLoading();
            Utils.showToast('Registration successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'pages/student/dashboard.html';
            }, 1500);

        } catch (error) {
            Utils.hideLoading();
            Utils.showToast(error.message || 'Registration failed', 'error');
        }
    }

    static async registerStaff() {
        const fullName = document.getElementById('staffRegFullName').value.trim();
        const email = document.getElementById('staffRegEmail').value.trim();
        const contactNumber = document.getElementById('staffRegContact').value.trim();
        const password = document.getElementById('staffRegPassword').value;

        if (!fullName || !email || !contactNumber || !password) {
            Utils.showToast('Please fill in all required fields', 'warning');
            return;
        }
        if (password.length < 6) {
            Utils.showToast('Password must be at least 6 characters', 'warning');
            return;
        }

        const formData = {
            name: fullName, email, password,
            role: CONFIG.ROLES.STAFF,
            contactNumber
        };

        try {
            Utils.showLoading('Creating staff account...');
            await api.register(formData);
            Utils.hideLoading();
            Utils.showToast('Staff account created! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'pages/staff/dashboard.html';
            }, 1500);

        } catch (error) {
            Utils.hideLoading();
            Utils.showToast(error.message || 'Registration failed', 'error');
        }
    }

    // ✅ FIXED: Logout uses correct path
    static logout() {
        api.logout();
        window.location.href = Auth.getIndexPath();
    }

    // ✅ FIXED: checkAuth uses correct path
    static checkAuth(requiredRole = null) {
        if (!api.isAuthenticated()) {
            window.location.href = Auth.getIndexPath();
            return false;
        }

        if (requiredRole && api.getUserRole() !== requiredRole) {
            Utils.showToast('Access denied', 'error');
            setTimeout(() => {
                window.location.href = Auth.getIndexPath();
            }, 1500);
            return false;
        }

        return true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

window.Auth = Auth;