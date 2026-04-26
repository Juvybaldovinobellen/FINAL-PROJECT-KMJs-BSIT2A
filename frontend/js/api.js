// ============================================
// BU TRANSAKTO - API Service
// ============================================

class ApiService {
    constructor() {
        this.baseUrl = CONFIG.API_BASE_URL;
        this.token = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
        } else {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        }
    }

    getHeaders(requiresAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (requiresAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint, method = 'GET', body = null, requiresAuth = true) {
        const config = {
            method,
            headers: this.getHeaders(requiresAuth)
        };
        if (body) config.body = JSON.stringify(body);

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, config);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Request failed');
            return data;
        } catch (error) {
            console.error(`API Error [${method} ${endpoint}]:`, error);
            throw error;
        }
    }

    // Auth
    async register(userData) {
        const data = await this.request('/auth/register', 'POST', userData, false);
        if (data.token) {
            this.setToken(data.token);
            this.saveUserData(data);
        }
        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', 'POST', { email, password }, false);
        if (data.token) {
            this.setToken(data.token);
            this.saveUserData(data);
        }
        return data;
    }

    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    // Requests
    async createRequest(requestData) {
        return await this.request('/requests', 'POST', requestData);
    }

    async getMyRequests() {
        return await this.request('/requests/myrequests');
    }

    async getAllRequests() {
        return await this.request('/requests/all');
    }

    async updateRequestStatus(requestId, status) {
        return await this.request(`/requests/${requestId}/status`, 'PUT', { status });
    }

    // Notifications
    async getNotifications() {
        return await this.request('/notifications');
    }

    async markNotificationRead(id) {
        return await this.request(`/notifications/${id}/read`, 'PUT');
    }

    async markAllNotificationsRead() {
        return await this.request('/notifications/read-all', 'PUT');
    }

    async deleteNotification(id) {
        return await this.request(`/notifications/${id}`, 'DELETE');
    }

    // Feedback
    async submitFeedback(data) {
        return await this.request('/feedback', 'POST', data);
    }

    async getAllFeedback() {
        return await this.request('/feedback');
    }

    async getFeedbackStats() {
        return await this.request('/feedback/stats');
    }

    // Staff
    async getStaffStats() {
        return await this.request('/staff/stats');
    }

    async getAllStudents() {
        return await this.request('/staff/students');
    }

    // Users
    async updateProfile(userId, data) {
        return await this.request(`/users/${userId}`, 'PUT', data);
    }

    async changePassword(userId, currentPassword, newPassword) {
        return await this.request(`/users/${userId}/password`, 'PUT', { currentPassword, newPassword });
    }

    // Helpers
    saveUserData(data) {
        const userData = {
            _id: data._id, name: data.name, email: data.email,
            role: data.role, studentId: data.studentId, course: data.course,
            yearLevel: data.yearLevel, contactNumber: data.contactNumber, address: data.address
        };
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_ROLE, data.role);
    }

    getUserData() {
        const data = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_DATA);
        return data ? JSON.parse(data) : null;
    }

    getUserRole() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.USER_ROLE);
    }

    isAuthenticated() {
        return !!this.token && !!this.getUserData();
    }

    logout() {
        this.setToken(null);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_ROLE);
    }
}

const api = new ApiService();
window.api = api;
const BASE_URL = 'http://localhost:5000/api'; 