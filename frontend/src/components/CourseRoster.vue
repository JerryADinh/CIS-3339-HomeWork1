<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  courses: {
    type: Array,
    required: true
  },
  selectedCourseId: {
    type: String,
    default: ''
  },
  rosterStudents: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select-course']);

const localCourseId = ref(props.selectedCourseId);

watch(
  () => props.selectedCourseId,
  (newVal) => {
    localCourseId.value = newVal;
  }
);

function handleListStudents() {
  emit('select-course', localCourseId.value);
}
</script>

<template>
  <section class="section-block">
    <h1>Students in Course</h1>

    <div class="form-row">
      <label for="rosterCourseSelect">Select Course: </label>
      <select
        id="rosterCourseSelect"
        v-model="localCourseId"
        @change="handleListStudents"
      >
        <option value="">-- Select Course --</option>
        <option
          v-for="course in courses"
          :key="course._id"
          :value="course._id"
        >
          {{ course.courseName }} ({{ course.courseId }})
        </option>
      </select>
      <button
        type="button"
        class="inline-btn"
        :disabled="loading"
        @click="handleListStudents"
      >
        List Students
      </button>
    </div>

    <table border="1" class="classic-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Phone</th>
          <th>Zip</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in rosterStudents" :key="student._id || student.studentId">
          <td>{{ student.name }}</td>
          <td>{{ student.studentId }}</td>
          <td>{{ student.phone }}</td>
          <td>{{ student.zip }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>