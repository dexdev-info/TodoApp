import api, { getCsrfToken } from '../axios';

export const authService = {
    register: async (userData) => {
        await getCsrfToken();
        const response = await api.post('/api/register', userData);
        return response.data;
    },

    login: async (email, password) => {
        await getCsrfToken();
        const response = await api.post('/api/login', { email, password });
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }
        // Cookie tự động xóa bởi server
    },

    getCurrentUser: async () => {
        const response = await api.get('/api/me');
        return response.data.user;
    },

    // CHECK IF LOGGED IN
    isAuthenticated: async () => {
        // KHÔNG THỂ check localStorage nữa!
        // Phải gọi API để verify
        try {
            await api.get('/api/me');
            return true;
        } catch {
            return false;
        }
    }

};