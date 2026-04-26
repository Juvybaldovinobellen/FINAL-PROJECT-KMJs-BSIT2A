// ============================================
// BU TRANSAKTO - Utility Functions
// ============================================

class Utils {
    /**
     * Format date to readable string
     */
    static formatDate(dateString, format = 'long') {
        const date = new Date(dateString);
        const options = {
            long: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
            short: { year: 'numeric', month: 'short', day: 'numeric' },
            time: { hour: '2-digit', minute: '2-digit' }
        };
        return date.toLocaleDateString('en-US', options[format] || options.long);
    }

    /**
     * Get time ago string
     */
    static timeAgo(dateString) {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date() - date) / 1000);
        
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 }
        ];
        
        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
            }
        }
        return 'Just now';
    }

    /**
     * Show toast notification
     */
    static showToast(message, type = 'info', duration = 4000) {
        // Create container if not exists
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${icons[type]} toast-icon"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Show loading overlay
     */
    static showLoading(message = 'Loading...') {
        this.hideLoading();
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div style="text-align:center;">
                <div class="loading-spinner"></div>
                <p style="margin-top:1rem;color:var(--gray-600);">${message}</p>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    /**
     * Hide loading overlay
     */
    static hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.remove();
    }

    /**
     * Generate avatar URL
     */
    static getAvatarUrl(name, size = 40) {
        const initial = name ? name.charAt(0).toUpperCase() : 'U';
        return `https://ui-avatars.com/api/?background=1a56db&color=fff&rounded=true&bold=true&size=${size}&name=${initial}`;
    }

    /**
     * Confirm dialog
     */
    static async confirm(message, title = 'Confirm') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal" style="max-width:420px;">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary btn-sm" id="confirm-cancel">Cancel</button>
                        <button class="btn btn-primary btn-sm" id="confirm-ok">Confirm</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            
            const close = () => overlay.remove();
            
            overlay.querySelector('.modal-close').onclick = () => { close(); resolve(false); };
            overlay.querySelector('#confirm-cancel').onclick = () => { close(); resolve(false); };
            overlay.querySelector('#confirm-ok').onclick = () => { close(); resolve(true); };
            overlay.onclick = (e) => { if (e.target === overlay) { close(); resolve(false); } };
        });
    }

    /**
     * Alert dialog
     */
    static alert(message, title = 'Alert', type = 'info') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            const iconColors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
            const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
            overlay.innerHTML = `
                <div class="modal" style="max-width:400px;text-align:center;">
                    <div class="modal-body" style="padding:2rem;">
                        <div style="font-size:3rem;margin-bottom:1rem;">${icons[type]}</div>
                        <h3 style="margin-bottom:0.5rem;">${title}</h3>
                        <p style="color:var(--gray-600);">${message}</p>
                        <button class="btn btn-primary mt-3" id="alert-ok" style="width:auto;padding:0.5rem 2rem;">OK</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
            
            const close = () => { overlay.remove(); resolve(); };
            overlay.querySelector('#alert-ok').onclick = close;
            overlay.onclick = (e) => { if (e.target === overlay) close(); };
        });
    }

    /**
     * Sanitize HTML
     */
    static sanitize(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Get status color
     */
    static getStatusColor(status) {
        const colors = {
            pending: { bg: '#fef3c7', text: '#92400e', label: 'Pending' },
            processing: { bg: '#dbeafe', text: '#1e40af', label: 'Processing' },
            completed: { bg: '#d1fae5', text: '#065f46', label: 'Completed' },
            rejected: { bg: '#fee2e2', text: '#991b1b', label: 'Rejected' },
            approved: { bg: '#dbeafe', text: '#1e40af', label: 'Approved' }
        };
        return colors[status] || { bg: '#f1f5f9', text: '#475569', label: status };
    }

    /**
     * Generate random ID
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Debounce function
     */
    static debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Capitalize first letter
     */
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Truncate text
     */
    static truncate(str, length = 50) {
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    }
}

// Export for use
window.Utils = Utils;