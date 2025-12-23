import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfirmStore = defineStore('confirm', () => {
  const isOpen = ref(false)
  const options = ref({
    title: 'Xác nhận',
    message: '',
  })

  let resolver = null

  const confirm = ({ title, message }) => {
    options.value = {
      title: title ?? 'Xác nhận',
      message,
    }

    isOpen.value = true

    return new Promise((resolve) => {
      resolver = resolve
    })
  }

  const accept = () => {
    isOpen.value = false
    resolver?.(true)
    resolver = null
  }

  const cancel = () => {
    isOpen.value = false
    resolver?.(false)
    resolver = null
  }

  return {
    // state
    isOpen,
    options,

    // actions
    confirm,
    accept,
    cancel,
  }
})
