<script setup>
import { ref } from 'vue';

defineProps({
  students: {
    type: Array,
    required: true
  },
  courses: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['enroll-student']);

const selectedStudentId = ref('');
const selectedCourseId = ref('');
const validationError = ref('');

function handleSubmit() {
  validationError.value = '';
  if (!selectedStudentId.value || !selectedCourseId.value) {
    validationError.value = 'Please select both a student and a course.';
    return;
  }

  emit('enroll-student', selectedStudentId.value, selectedCourseId.value, () => {
    selectedStudentId.value = '';
    selectedCourseId.value = '';
  });
}
</script>

<template>
  <section class="section-block">
    <h1>Enroll Student in Course</h1>
    <p v-if="validationError" class="error-text">{{ validationError }}</p>

    <form @submit.prevent="handleSubmit" novalidate>
      <div class="form-row">
        <label for="enrollStudentSelect">Select Student: </label>
        <select id="enrollStudentSelect" v-model="selectedStudentId" required>
          <option value="">-- Select Student --</option>
          <option
            v-for="student in students"
            :key="student._id"
            :value="student._id"
          >
            {{ student.name }} ({{ student.studentId }})
          </option>
        </select>
      </div>

      <div class="form-row">
        <label for="enrollCourseSelect">Select Course: </label>
        <select id="enrollCourseSelect" v-model="selectedCourseId" required>
          <option value="">-- Select Course --</option>
          <option
            v-for="course in courses"
            :key="course._id"
            :value="course._id"
          >
            {{ course.courseName }} ({{ course.courseId }})
          </option>
        </select>
      </div>

      <div class="form-row">
        <button type="submit" :disabled="loading">Enroll Student</button>
      </div>
    </form>
  </section>
</template>