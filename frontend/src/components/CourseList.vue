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

const emit = defineEmits(['delete-course']);

function confirmDelete(course) {
  if (
    window.confirm(
      `Delete course "${course.courseId} - ${course.courseName}"? This will also remove all enrollments for this course.`
    )
  ) {
    emit('delete-course', course);
  }
}
</script>

<template>
  <section class="card">
    <div class="card-header">
      <h2 class="card-title">All Courses</h2>
      <span class="badge-muted">{{ courses.length }} course(s)</span>
    </div>

    <div v-if="loading" class="empty-state">Loading courses...</div>

    <div v-else-if="courses.length === 0" class="empty-state">
      No courses have been added yet. Use the form above to add a course.
    </div>

    <div v-else class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course._id || course.courseId">
            <td><code>{{ course.courseId }}</code></td>
            <td class="font-medium">{{ course.courseName }}</td>
            <td>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="confirmDelete(course)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>