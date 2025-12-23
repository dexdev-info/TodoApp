import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/api/services/authService';

export const useAuthStore = defineStore('auth', () => {
  // ================= STATE =================
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const isInitialized = ref(false); // Đã check session lần đầu chưa

  // ================= GETTERS =================
  const isAuthenticated = computed(() => !!user.value);

  // ================= ACTIONS =================

  // 1. Init: Check session 1 lần khi APP START
  const init = async () => {
    if (isInitialized.value) return; // Chỉ chạy 1 lần

    loading.value = true;
    try {
      // Gọi API /me để kiểm tra session
      const userData = await authService.getCurrentUser();
      user.value = userData;
      console.log('✅ Session restored:', userData.name);
    } catch {
      // Không có session hợp lệ
      user.value = null;
      console.log('ℹ️ No active session');
    } finally {
      loading.value = false;
      isInitialized.value = true;
    }
  };

  // 2. Login
  const login = async (email, password) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(email, password);
      user.value = response.user;
      return response;
    } catch (err) {
      error.value = err.errors || err.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 3. Register
  const register = async (userData) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      error.value = err.errors || err.message || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 4. Logout
  const logout = async () => {
    loading.value = true;

    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      user.value = null;
      isInitialized.value = false; // cho phép init lại nếu cần
      loading.value = false;
    }
  };

  // Dùng khi cần REFRESH
  const refreshUser = async () => {
    loading.value = true;

    try {
      const userData = await authService.getCurrentUser();
      user.value = userData;
      return userData;
    } catch (err) {
      error.value = err.errors || err.message || 'Failed to fetch user';
      user.value = null;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    // States
    user,
    loading,
    error,
    isInitialized,

    // Getters
    isAuthenticated,

    // Methods
    init,
    login,
    register,
    logout,
    refreshUser
  };
});