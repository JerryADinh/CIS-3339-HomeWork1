<script setup>
defineProps({
  courses: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['list-courses', 'delete-course']);
</script>

<template>
  <section class="section-block">
    <h1>Courses List</h1>
    <div class="form-row">
      <button type="button" :disabled="loading" @click="emit('list-courses')">
        List Courses
      </button>
    </div>

    <table border="1" class="classic-table">
      <thead>
        <tr>
          <th>Class ID</th>
          <th>Class Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course._id || course.courseId">
          <td>{{ course.courseId }}</td>
          <td>{{ course.courseName }}</td>
          <td>
            <button type="button" @click="emit('delete-course', course)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>