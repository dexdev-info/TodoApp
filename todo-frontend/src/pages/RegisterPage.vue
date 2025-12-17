<script setup>
import { ref, reactive } from 'vue';
import { useAuth } from '@/composables/useAuth';

const { register, loading, error } = useAuth();

// ========================================
// FORM STATE
// ========================================
const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
});

const validationErrors = ref({});

// ========================================
// HANDLE REGISTER
// ========================================
const handleRegister = async () => {
    validationErrors.value = {};

    try {
        await register(form);
        // Success → useAuth tự redirect đến /todos
    } catch (err) {
        // Hiển thị validation errors
        if (err.errors) {
            validationErrors.value = err.errors;
        }
    }
};
</script>

<template>
    <div class="register-page">
        <div class="register-container">
            <div class="register-card">
                <h1>📝 Đăng Ký</h1>
                <p class="subtitle">Tạo tài khoản mới để bắt đầu</p>

                <!-- Error message -->
                <div v-if="error && !validationErrors.name" class="alert alert-error">
                    {{ typeof error === 'string' ? error : 'Registration failed' }}
                </div>

                <!-- Form -->
                <form @submit.prevent="handleRegister">
                    <!-- Name -->
                    <div class="form-group">
                        <label for="name">Tên</label>
                        <input id="name" v-model="form.name" type="text" placeholder="Nhập tên của bạn"
                            :class="{ 'input-error': validationErrors.name }">
                        <span v-if="validationErrors.name" class="error-text">
                            {{ validationErrors.name[0] }}
                        </span>
                    </div>

                    <!-- Email -->
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="email" v-model="form.email" type="email" placeholder="example@email.com"
                            :class="{ 'input-error': validationErrors.email }">
                        <span v-if="validationErrors.email" class="error-text">
                            {{ validationErrors.email[0] }}
                        </span>
                    </div>

                    <!-- Password -->
                    <div class="form-group">
                        <label for="password">Mật khẩu</label>
                        <input id="password" v-model="form.password" type="password" placeholder="Tối thiểu 8 ký tự"
                            :class="{ 'input-error': validationErrors.password }">
                        <span v-if="validationErrors.password" class="error-text">
                            {{ validationErrors.password[0] }}
                        </span>
                    </div>

                    <!-- Password Confirmation -->
                    <div class="form-group">
                        <label for="password_confirmation">Xác nhận mật khẩu</label>
                        <input id="password_confirmation" v-model="form.password_confirmation" type="password"
                            placeholder="Nhập lại mật khẩu">
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn-submit" :disabled="loading">
                        {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
                    </button>
                </form>

                <!-- Link to Login -->
                <div class="form-footer">
                    <p>
                        Đã có tài khoản?
                        <RouterLink to="/login">Đăng nhập ngay</RouterLink>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.register-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
}

.register-container {
    width: 100%;
    max-width: 450px;
}

.register-card {
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
