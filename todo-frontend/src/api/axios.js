import axios from 'axios';

// Hàm helper để đọc cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// CONFIG
// const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_TIMEOUT = 10000;

// ========================================
// CREATE AXIOS INSTANCE
// ========================================
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Gửi kèm Cookie
});

// ========================================
// CSRF TOKEN HELPER
// ========================================
// Laravel set XSRF-TOKEN cookie
export const getCsrfToken = async () => {
    await axiosInstance.get('/sanctum/csrf-cookie');
};

// ========================================
// REQUEST INTERCEPTOR - Kẻ gác cổng CHIỀU ĐI
// Chạy TRƯỚC khi request gửi đi bay ra khỏi Vue
// ========================================
axiosInstance.interceptors.request.use(
    (config) => {
        // Tự lấy token XSRF nhét vào header
        const token = getCookie('XSRF-TOKEN');
        if (token) {
            // Token trong cookie bị mã hóa URL, phải decode ra
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
        }
        
        // Log request (dev only)
        if (import.meta.env.DEV) {
            console.log('🚀 Request:', config.method.toUpperCase(), config.url);
        }

        return config;
    },
    (error) => {
        // Xử lý lỗi trước khi request gửi đi (rare case)
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// ========================================
// RESPONSE INTERCEPTOR - Kẻ gác cổng CHIỀU VỀ về đến Vue (trước khi vào .then/.catch)
// Chạy SAU khi nhận response từ server
// ========================================
axiosInstance.interceptors.response.use(
    (response) => {
        // Nếu thành công (200, 201), trả về data luôn
        // Log response (dev only)
        if (import.meta.env.DEV) {
            console.log('✅ Response:', response.status, response.config.url);
        }

        return response;
    },
    (error) => {
        // Response lỗi (status 4xx, 5xx)

        // Log error
        console.error('❌ Response Error:', error.response?.status, error.message);

        // Xử lý các lỗi phổ biến
        if (error.response) {
            // Server trả về response (có status code)

            switch (error.response.status) {
                case 401:
                    // Unauthorized - Token hết hạn hoặc không hợp lệ
                    console.warn('🔒 Unauthorized - Token expired or invalid.');
                    break;

                case 419:
                    // CSRF token mismatch
                    console.warn('🔐 CSRF token mismatch - Refreshing...');
                    // Có thể retry với token mới
                    break;

                case 403:
                    // Forbidden - Không có quyền
                    console.warn('🚫 Forbidden - You don\'t have permission');
                    break;

                case 404:
                    // Not Found
                    console.warn('🔍 Not Found');
                    break;

                case 422:
                    // Validation Error (Laravel)
                    console.warn('⚠️ Validation Error:', error.response.data.errors);
                    break;

                case 500:
                    // Server Error
                    console.error('💥 Server Error - Please try again later');
                    break;

                default:
                    console.error('❌ Unknown Error:', error.response.status);
            }

            // Trả về error data từ Laravel
            return Promise.reject(error.response.data);

        } else if (error.request) {
            // Request đã gửi nhưng không nhận được response
            // (Network error, timeout, CORS...)
            console.error('🌐 Network Error - Check your connection');
            return Promise.reject({
                message: 'Network error. Please check your connection.'
            });

        } else {
            // Lỗi khác (config sai, ...)
            console.error('⚠️ Error:', error.message);
            return Promise.reject({
                message: error.message
            });
        }
    }
);

export default axiosInstance;
