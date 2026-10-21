<script setup>
import { reactive, ref } from 'vue';

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit-course']);

const form = reactive({
  courseId: '',
  courseName: ''
});

const validationError = ref('');

function handleSubmit() {
  validationError.value = '';
  const courseId = form.courseId.trim();
  const courseName = form.courseName.trim();

  if (!courseId || !courseName) {
    validationError.value = 'Both Course ID and Course Name are required.';
    return;
  }

  emit('submit-course', { courseId, courseName }, () => {
    form.courseId = '';
    form.courseName = '';
  });
}
</script>

<template>
  <section class="card">
    <h2 class="card-title">Add a Course</h2>
    <p v-if="validationError" class="inline-error" role="alert">{{ validationError }}</p>

    <form class="form-grid" @submit.prevent="handleSubmit" novalidate>
      <div class="form-group">
        <label for="courseId">Course ID *</label>
        <input
          id="courseId"
          v-model="form.courseId"
          type="text"
          placeholder="e.g., CIS 3339"
          required
        />
      </div>

      <div class="form-group">
        <label for="courseName">Course Name *</label>
        <input
          id="courseName"
          v-model="form.courseName"
          type="text"
          placeholder="e.g., Enterprise Applications Development"
          required
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Saving...' : 'Add Course' }}
        </button>
      </div>
    </form>
  </section>
</template>