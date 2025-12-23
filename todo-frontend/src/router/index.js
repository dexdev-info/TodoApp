import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'

import HomePage from '@/pages/HomePage.vue';
import TodoPage from '@/pages/TodoPage.vue';
import AboutPage from '@/pages/AboutPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
        meta: { title: 'Trang chủ' }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: {
            title: 'Đăng nhập',
            guest: true
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
        meta: {
            title: 'Đăng ký',
            guest: true
        }
    },
    {
        path: '/todos',
        name: 'Todos',
        component: TodoPage,
        meta: {
            title: 'Todo List',
            requiresAuth: true
        }
    },
    {
        path: '/about',
        name: 'About',
        component: AboutPage,
        meta: { title: 'Về dự án' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/pages/NotFoundPage.vue'),
        meta: { title: '404 Not Found' }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// ========================================
// NAVIGATION GUARD - Kẻ gác cổng Router
// ========================================
router.beforeEach(async (to, from) => {
    // 1. Set title
    document.title = to.meta.title || 'Vue Todo App';

    // 2. Lấy auth store
    const authStore = useAuthStore()

    // 3. WAIT FOR INIT (Quan trọng khi F5 trang)
    // Nếu chưa init xong (chưa check session với server), thì phải đợi
    if (!authStore.isInitialized) {
        await authStore.init();
    }

    // 4. CHECK QUYỀN TRUY CẬP
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return {
            name: 'Login',
            query: { redirect: to.fullPath }
        }
    }

    if (to.meta.guest && authStore.isAuthenticated) {
        return { name: 'Todos' }
    }

    // 5. Cho qua
    return true
});

export default router;