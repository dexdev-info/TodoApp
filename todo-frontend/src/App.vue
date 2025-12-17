<script setup>
// App.vue giờ chỉ là "vỏ bọc" chứa layout chung, không còn logic gì!
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { computed } from 'vue';

const route = useRoute();
const { user, isAuthenticated, logout } = useAuth();

// Check xem có phải trang Home không (để ẩn navbar)
const isHomePage = computed(() => route.path === '/');

const handleLogout = async () => {
  if (confirm('Bạn có chắc muốn đăng xuất không?')) {
    await logout();
    // useAuth sẽ tự redirect về trang Home
  }
}
</script>

<template>
  <div id="app">
    <!-- Navbar -->
    <nav v-if="!isHomePage" class="navbar">
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

  <!-- 
    Giải thích:
    
    <RouterView>
    ☝️ Component tương ứng với route hiện tại sẽ render ở đây
    
    VD: URL = /todos
    → TodoApp.vue render vào đây
    
    URL = /about
    → AboutPage.vue render vào đây
    
    v-slot="{ Component }"
    ☝️ Lấy component hiện tại để wrap trong <Transition>
    
    <Transition name="fade">
    ☝️ Hiệu ứng fade khi chuyển trang
    -->
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
</style>