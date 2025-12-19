import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

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
            guest: true // 👈 Chỉ dành cho khách (chưa login)
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
        meta: {
            title: 'Đăng ký',
            guest: true // 👈 Chỉ dành cho khách
        }
    },
    {
        path: '/todos',
        name: 'Todos',
        component: TodoPage,
        meta: {
            title: 'Todo List',
            requiresAuth: true // 👈 Cần đăng nhập mới vào được
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
router.beforeEach(async (to, from, next) => {
    // 1. Set title
    document.title = to.meta.title || 'Vue Todo App';

    // 2. Lấy state từ useAuth
    // Lưu ý: useAuth dùng global state nên gọi ở đây thoải mái
    const { isAuthenticated, isInitialized, init } = useAuth();

    // 3. WAIT FOR INIT (Quan trọng khi F5 trang)
    // Nếu chưa init xong (chưa check session với server), thì phải đợi
    if (!isInitialized.value) {
        await init();
    }

    // 4. CHECK QUYỀN TRUY CẬP
    if (to.meta.requiresAuth && !isAuthenticated.value) {
        // A. Cần login mà chưa login -> Đá về login
        next({ name: 'Login', query: { redirect: to.fullPath } });
        return;
    } else if (to.meta.guest && isAuthenticated.value) {
        // B. Trang khách (Login/Register) mà đã login rồi -> Đá về Todos
        next({ name: 'Todos' });
        return;
    } else {
        // C. Hợp lệ -> Cho qua
        next();
    }
});

export default router;