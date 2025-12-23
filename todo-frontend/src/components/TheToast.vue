<script setup>
import { useToastStore } from '@/stores/toastStore';
const toastStore = useToastStore();
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div v-for="toast in toastStore.toasts" :key="toast.id" class="toast-item" :class="toast.type">
        {{ toast.message }}
        <span class="close-btn" @click="toastStore.remove(toast.id)">×</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-item {
  min-width: 250px;
  padding: 12px 20px;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.toast-item.success {
  background-color: #10B981;
}

/* Green */
.toast-item.error {
  background-color: #EF4444;
}

/* Red */
.toast-item.info {
  background-color: #3B82F6;
}

/* Blue */

.close-btn {
  margin-left: 10px;
  opacity: 0.7;
  font-size: 18px;
}

/* Animation Vue TransitionGroup */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>