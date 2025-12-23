import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);

  // Thêm thông báo mới
  const add = (message, type = 'success', duration = 3000) => {
    const id = Date.now();

    toasts.value.push({ id, message, type });

    // Tự động xóa sau duration
    setTimeout(() => {
      remove(id);
    }, duration);
  };

  // Xóa thông báo
  const remove = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  const success = (msg) => add(msg, 'success');
  const error = (msg) => add(msg, 'error');
  const info = (msg) => add(msg, 'info');

  return { toasts, add, remove, success, error, info };
});