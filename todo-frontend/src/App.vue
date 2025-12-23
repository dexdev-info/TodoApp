<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';

/* ======================
  SETUP
====================== */
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { user, isAuthenticated, loading: authLoading, isInitialized } = storeToRefs(authStore);

// Check xem có phải trang Home không (để ẩn navbar)
const isHomePage = computed(() => route.name === 'home');

// INIT AUTH / verify session khi app start
onMounted(() => authStore.init());

const handleLogout = async () => {
  if (!confirm('Bạn có chắc muốn đăng xuất không?')) return;
  await authStore.logout();
  router.push('/login');
};

</script>

<template>
  <div id="app">

    <!-- Init Loading -->
    <div v-if="authLoading && !isAuthenticated" class="init-loading">
      <div class="spinner"></div>
      <p>Đang khởi tạo...</p>
    </div>

    <!-- Navbar -->
    <nav v-if="!isHomePage && authStore.isInitialized" class="navbar">
      <div class="nav-container">
        <RouterLink to="/" class="logo">
          📝 Vue Todo
        </RouterLink>

        <ul class="nav-links">
          <li>
            <RouterLink to="/" :class="{ active: route.path === '/' }">
              🏠 Home
            </RouterLink>
          </li>

          <!-- Show nếu đã login -->
          <li v-if="isAuthenticated">
            <RouterLink to="/todos" :class="{ active: route.path === '/todos' }">
              ✅ Todos
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/about" :class="{ active: route.path === '/about' }">
              ℹ️ About
            </RouterLink>
          </li>

          <!-- Auth links -->
          <template v-if="isAuthenticated">
            <li class="user-info">
              <span>👤 {{ user?.name }}</span>
            </li>
            <li>
              <button @click="handleLogout" class="btn-logout">
                🚪 Logout
              </button>
            </li>
          </template>

          <template v-else>
            <li>
              <RouterLink to="/login" :class="{ active: route.path === '/login' }">
                🔐 Login
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/register" :class="{ active: route.path === '/register' }">
                📝 Register
              </RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </nav>

    <!-- Router View -->
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
/* ========================================
    GLOBAL STYLES
   ======================================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

/* ========================================
    NAVBAR STYLES
   ======================================== */
.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

.logo:hover {
  color: #5568d3;
}

.nav-links {
  display: flex;
  gap: 8px;
  list-style: none;
}

.nav-links a {
  padding: 8px 16px;
  color: #666;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-links a:hover {
  background: #f5f5f5;
  color: #333;
}

.nav-links a.active {
  background: #667eea;
  color: white;
}

/* ========================================
    TRANSITION STYLES
   ======================================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 16px;
  }

  .nav-links {
    gap: 12px;
  }

  .nav-link {
    font-size: 14px;
    padding: 6px 12px;
  }
}

.user-info {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: #333;
  font-weight: 500;
}

.btn-logout {
  padding: 8px 16px;
  background: transparent;
  color: #666;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #fee;
  color: #f44;
}

/* Init loading overlay */
.init-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.init-loading .spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.init-loading p {
  color: #666;
  font-size: 16px;
}
</style>