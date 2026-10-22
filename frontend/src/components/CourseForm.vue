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
    validationError.value = 'Both Class ID and Class Name are required.';
    return;
  }

  emit('submit-course', { courseId, courseName }, () => {
    form.courseId = '';
    form.courseName = '';
  });
}
</script>

<template>
  <section class="section-block">
    <h1>Add a Course</h1>
    <p v-if="validationError" class="error-text">{{ validationError }}</p>

    <form @submit.prevent="handleSubmit" novalidate>
      <div class="form-row">
        <label for="courseId">Class ID: </label>
        <input id="courseId" v-model="form.courseId" type="text" required />
      </div>
      <div class="form-row">
        <label for="courseName">Class Name: </label>
        <input id="courseName" v-model="form.courseName" type="text" required />
      </div>
      <div class="form-row">
        <button type="submit" :disabled="loading">Add Course</button>
      </div>
    </form>
  </section>
</template>