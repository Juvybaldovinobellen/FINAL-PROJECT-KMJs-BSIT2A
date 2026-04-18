// frontend/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Store token for authenticated requests
let authToken = localStorage.getItem('authToken');

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', body = null, requiresAuth = true) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (requiresAuth && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const config = {
        method,
        headers,
    };
    
    if (body) {
        config.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API call failed');
        }
        
        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

// Auth APIs
async function registerUser(userData) {
    return await apiCall('/auth/register', 'POST', userData, false);
}

async function loginUser(email, password) {
    const data = await apiCall('/auth/login', 'POST', { email, password }, false);
    if (data.token) {
        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
}

async function getCurrentUser() {
    return await apiCall('/auth/me', 'GET', null, true);
}

// Document Request APIs
async function createRequest(requestData) {
    return await apiCall('/requests', 'POST', requestData, true);
}

async function getMyRequests() {
    return await apiCall('/requests/myrequests', 'GET', null, true);
}

// Staff APIs
async function getAllRequests() {
    return await apiCall('/requests/all', 'GET', null, true);
}

async function updateRequestStatus(requestId, status) {
    return await apiCall(`/requests/${requestId}/status`, 'PUT', { status }, true);
}

async function getStaffStats() {
    return await apiCall('/staff/stats', 'GET', null, true);
}

async function getAllStudents() {
    return await apiCall('/staff/students', 'GET', null, true);
}

// Feedback APIs
async function submitFeedback(feedbackData) {
    return await apiCall('/feedback', 'POST', feedbackData, true);
}

async function getAllFeedback() {
    return await apiCall('/feedback', 'GET', null, true);
}

// Notification APIs
async function getNotifications() {
    return await apiCall('/notifications', 'GET', null, true);
}

async function markNotificationAsRead(notificationId) {
    return await apiCall(`/notifications/${notificationId}/read`, 'PUT', null, true);
}

// Logout
function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}