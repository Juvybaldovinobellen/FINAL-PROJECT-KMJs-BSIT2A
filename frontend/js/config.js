// frontend/js/config.js
// BU Transakto - Configuration

const CONFIG = {
    // API Configuration
    API_BASE_URL: 'http://localhost:5000/api',
    
    // Application Settings
    APP_NAME: 'BU Transakto',
    APP_VERSION: '1.0.0',
    UNIVERSITY: 'Bicol University',
    CAMPUS: 'Polangui Campus',
    
    // Storage Keys
    STORAGE_KEYS: {
        AUTH_TOKEN: 'bu_transakto_token',
        USER_DATA: 'bu_transakto_user',
        USER_ROLE: 'bu_transakto_role',
        NOTIFICATIONS: 'bu_transakto_notifications',
        SETTINGS: 'bu_transakto_settings'
    },
    
    // Document Types
    DOCUMENT_TYPES: [
        'Transcript of Records (TOR)',
        'Certificate of Grades',
        'Certificate of Registration',
        'Certificate of Enrollment',
        'Good Moral Certificate',
        'Diploma',
        'Copy of Grades',
        'Honorable Dismissal',
        'Certification of Units Earned',
        'Others'
    ],
    
    // Purposes
    PURPOSES: [
        'Employment',
        'Transfer to another school',
        'Scholarship Application',
        'Personal Records',
        'Government Requirement',
        'Board Exam',
        'Further Studies',
        'Visa Application',
        'Others'
    ],
    
    // Request Statuses
    STATUSES: ['pending', 'processing', 'completed', 'rejected'],
    
    // Roles
    ROLES: {
        STUDENT: 'student',
        STAFF: 'staff'
    }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.STORAGE_KEYS);
Object.freeze(CONFIG.DOCUMENT_TYPES);
Object.freeze(CONFIG.PURPOSES);
Object.freeze(CONFIG.STATUSES);