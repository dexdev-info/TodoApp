import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '@/api';

// Import pages
import HomePage from '@/pages/HomePage.vue';
import TodoPage from '@/pages/TodoPage.vue';
import AboutPage from '@/pages/AboutPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import RegisterPage from '@/pages/RegisterPage.vue';

// ========================================
// DEFINE ROUTES
// ========================================
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
        meta: { title: 'Đăng nhập' }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
        meta: { title: 'Đăng ký' }
    },
    {
        path: '/todos',
        name: 'Todos',
        component: TodoPage,
        meta: {
            title: 'Todo List',
            requiresAuth: true  // ← Protected route
        }
    },
    {
        path: '/about',
        name: 'About',
        component: AboutPage,
        meta: { title: 'Về dự án' }
    },
    // Catch-all route (404)
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/pages/NotFoundPage.vue')  // Lazy load
    },
    {
        path: '/todos/:id',  // ← :id là param
        name: 'TodoDetail',
        component: () => import('@/pages/TodoDetailPage.vue')
    },
    {
        path: '/test-api',
        name: 'TestAPI',
        component: () => import('@/pages/TestAPIPage.vue')
    }
];

// ========================================
// CREATE ROUTER INSTANCE
// ========================================
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// ========================================
// NAVIGATION GUARD - Check auth
// ========================================
router.beforeEach((to, from, next) => {
    // Chạy TRƯỚC mỗi lần chuyển route
    // Set document title
    document.title = to.meta.title || 'Vue Todo App';

    // Check if route requires auth
    if (to.meta.requiresAuth && !authService.isAuthenticated()) {
        // Route cần auth + User chưa login
        next({
            name: 'Login', // Redirect to login
            query: { redirect: to.fullPath }  // Lưu path để redirect sau login
        });
    } else {
        next(); // Cho phép vào route
    }
});

export default router;