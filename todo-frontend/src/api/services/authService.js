import api from '../axios';

export const authService = {

    // ========================================
    // REGISTER
    // ========================================
    register: async (userData) => {
        const response = await api.post('/register', userData);

        // Lưu token sau khi register thành công
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    },

    // ========================================
    // LOGIN
    // ========================================
    login: async (email, password) => {
        const response = await api.post('/login', { email, password });

        // Lưu token và user info
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    },

    // ========================================
    // LOGOUT
    // ========================================
    logout: async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            // Ignore error, xóa token anyway
            console.error('Logout error:', error);
        } finally {
            // Xóa token và user info
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    },

    // ========================================
    // GET CURRENT USER
    // ========================================
    getCurrentUser: async () => {
        const response = await api.get('/me');

        // Update user info trong localStorage
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data.user;
    },

    // ========================================
    // CHECK IF LOGGED IN
    // ========================================
    isAuthenticated: () => {
        return !!localStorage.getItem('auth_token');
    },

    // ========================================
    // GET STORED USER
    // ========================================
    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

};