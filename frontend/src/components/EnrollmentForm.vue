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
  });
}
</script>

<template>
  <section class="card">
    <h2 class="card-title">Enroll a Student in a Course</h2>
    <p v-if="validationError" class="inline-error" role="alert">{{ validationError }}</p>

    <form class="form-grid" @submit.prevent="handleSubmit" novalidate>
      <div class="form-group">
        <label for="enrollStudentSelect">Select Student *</label>
        <select id="enrollStudentSelect" v-model="selectedStudentId" required>
          <option value="" disabled>-- Choose a Student --</option>
          <option
            v-for="student in students"
            :key="student._id"
            :value="student._id"
          >
            {{ student.name }} (ID: {{ student.studentId }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="enrollCourseSelect">Select Course *</label>
        <select id="enrollCourseSelect" v-model="selectedCourseId" required>
          <option value="" disabled>-- Choose a Course --</option>
          <option
            v-for="course in courses"
            :key="course._id"
            :value="course._id"
          >
            {{ course.courseId }} — {{ course.courseName }}
          </option>
        </select>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading || students.length === 0 || courses.length === 0"
        >
          {{ loading ? 'Enrolling...' : 'Enroll Student' }}
        </button>
      </div>
    </form>

    <p v-if="students.length === 0 || courses.length === 0" class="helper-note">
      Note: You must have at least one student and one course created before adding an enrollment.
    </p>
  </section>
</template>