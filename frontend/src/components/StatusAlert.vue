<script setup>
defineProps({
  error: {
    type: String,
    default: ''
  },
  success: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['dismiss']);
</script>

<template>
  <div v-if="error || success" class="alerts-wrapper" role="status" aria-live="polite">
    <div v-if="error" class="alert alert-error">
      <span>{{ error }}</span>
      <button type="button" class="alert-close" aria-label="Close message" @click="emit('dismiss')">
        &times;
      </button>
    </div>
    <div v-if="success" class="alert alert-success">
      <span>{{ success }}</span>
      <button type="button" class="alert-close" aria-label="Close message" @click="emit('dismiss')">
        &times;
      </button>
    </div>
  </div>
</template>