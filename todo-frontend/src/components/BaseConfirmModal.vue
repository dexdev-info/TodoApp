<script setup>
defineProps({
  open: Boolean,
  title: String,
  message: String,
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="confirm-backdrop">
      <div class="confirm-overlay" @click="emit('cancel')" />

      <div class="confirm-modal">
        <!-- content -->
      </div>
    </div>
  </Teleport>

</template>
