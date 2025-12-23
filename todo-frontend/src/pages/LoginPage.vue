<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref(null);
const loading = ref(false);
const validationErrors = ref({});

// HANDLE LOGIN
const handleLogin = async () => {
    validationErrors.value = {};
    error.value = null;
    loading.value = true;

    try {
        await authStore.login(email.value, password.value);
        const redirect = route.query.redirect || '/todos';
        router.push(redirect);
    } catch (err) {
        // Hiển thị validation errors
        if (err.errors) {
            validationErrors.value = err.errors;
        } else {
            error.value = err.message || 'Đăng nhập thất bại';
        }
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="login-page">
        <div class="login-container">
            <div class="login-card">
                <h1>🔐 Đăng Nhập</h1>
                <p class="subtitle">Chào mừng bạn trở lại!</p>

                <!-- Error message -->
                <div v-if="error && !validationErrors.email" class="alert alert-error">
                    {{ error }}
                </div>

                <!-- Form -->
                <form @submit.prevent="handleLogin">
                    <!-- Email -->
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="email" v-model="email" type="email" placeholder="example@email.com"
                            :class="{ 'input-error': validationErrors.email }">
                        <span v-if="validationErrors.email" class="error-text">
                            {{ validationErrors.email[0] }}
                        </span>
                    </div>

                    <!-- Password -->
                    <div class="form-group">
                        <label for="password">Mật khẩu</label>
                        <input id="password" v-model="password" type="password" placeholder="Nhập mật khẩu"
                            :class="{ 'input-error': validationErrors.password }">
                        <span v-if="validationErrors.password" class="error-text">
                            {{ validationErrors.password[0] }}
                        </span>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn-submit" :disabled="loading">
                        {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
                    </button>
                </form>

                <!-- Link to Register -->
                <div class="form-footer">
                    <p>
                        Chưa có tài khoản?
                        <RouterLink to="/register">Đăng ký ngay</RouterLink>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Same CSS as RegisterPage */
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.login-container {
    width: 100%;
    max-width: 450px;
}

.login-card {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 8px;
}

.subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 32px;
}

.alert {
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
}

.alert-error {
    background: #fee;
    color: #c33;
    border-left: 4px solid #f44;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
}

input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
}

input:focus {
    outline: none;
    border-color: #667eea;
}

input.input-error {
    border-color: #f44;
}

.error-text {
    display: block;
    margin-top: 6px;
    color: #f44;
    font-size: 13px;
}

.btn-submit {
    width: 100%;
    padding: 14px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
    background: #5568d3;
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.form-footer {
    text-align: center;
    margin-top: 24px;
    color: #666;
}

.form-footer a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
}

.form-footer a:hover {
    text-decoration: underline;
}
</style>
