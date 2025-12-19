import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/api';

// ========================================
// GLOBAL STATE
// ========================================
const user = ref(null);
const loading = ref(false);
const error = ref(null);
const isInitialized = ref(false);

export function useAuth() {
    const router = useRouter();

    // ========================================
    // COMPUTED
    // ========================================
    const isAuthenticated = computed(() => !!user.value);

    // ========================================
    // INIT - Verify session khi app start
    // ========================================
    const init = async () => {
        if (isInitialized.value) return;  // Chỉ chạy 1 lần

        loading.value = true;

        try {
            // Gọi /api/me để check session còn hợp lệ không
            const userData = await authService.getCurrentUser();
            user.value = userData;
            console.log('✅ Session restored:', userData.name);
        } catch (err) {
            // Session không hợp lệ hoặc đã expire
            user.value = null;
            console.log('ℹ️ No active session');
        } finally {
            loading.value = false;
            isInitialized.value = true;
        }
    };

    // ========================================
    // REGISTER
    // ========================================
    const register = async (userData) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await authService.register(userData);
            user.value = response.user;

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

            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
            // Vẫn clear user dù có lỗi
            user.value = null;
            router.push('/login');
        } finally {
            loading.value = false;
        }
    };

    // ========================================
    // FETCH USER (Refresh user data)
    // ========================================
    const fetchUser = async () => {
        loading.value = true;

        try {
            const userData = await authService.getCurrentUser();
            user.value = userData;
            return userData;
        } catch (err) {
            console.error('Fetch user error:', err);
            user.value = null;
            throw err;
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
        isInitialized,

        // Methods
        init,
        register,
        login,
        logout,
        fetchUser
    };
}
