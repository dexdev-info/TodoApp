import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/api';

// ========================================
// GLOBAL STATE - Shared giữa components
// ========================================
const user = ref(authService.getStoredUser());
const loading = ref(false);
const error = ref(null);

export function useAuth() {
    const router = useRouter();

    // ========================================
    // COMPUTED
    // ========================================
    const isAuthenticated = computed(() => !!user.value);

    // ========================================
    // REGISTER
    // ========================================
    const register = async (userData) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await authService.register(userData);
            user.value = response.user;

            // Redirect to todos
            router.push('/todos');

            return response;
        } catch (err) {
            error.value = err.errors || err.message || 'Registration failed';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // ========================================
    // LOGIN
    // ========================================
    const login = async (email, password) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await authService.login(email, password);
            user.value = response.user;

            // Redirect to todos
            router.push('/todos');

            return response;
        } catch (err) {
            error.value = err.errors || err.message || 'Login failed';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // ========================================
    // LOGOUT
    // ========================================
    const logout = async () => {
        loading.value = true;

        try {
            await authService.logout();
            user.value = null;

            // Redirect to login
            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            loading.value = false;
        }
    };

    // ========================================
    // FETCH CURRENT USER (Verify token)
    // ========================================
    const fetchUser = async () => {
        if (!authService.isAuthenticated()) {
            user.value = null;
            return;
        }

        loading.value = true;

        try {
            const userData = await authService.getCurrentUser();
            user.value = userData;
        } catch (err) {
            // Token invalid → Clear user
            console.error('Fetch user error:', err);
            user.value = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        } finally {
            loading.value = false;
        }
    };

    return {
        // State
        user,
        loading,
        error,
        isAuthenticated,

        // Methods
        register,
        login,
        logout,
        fetchUser
    };
}
