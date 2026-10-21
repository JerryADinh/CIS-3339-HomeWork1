<script setup>
defineProps({
  title: {
    type: String,
    default: 'Students'
  },
  students: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'No students found.'
  }
});

const emit = defineEmits(['delete-student']);

function confirmDelete(student) {
  if (window.confirm(`Delete student ${student.name} (ID: ${student.studentId})? This will also remove their course enrollments.`)) {
    emit('delete-student', student);
  }
}
</script>

<template>
  <section class="card">
    <div class="card-header">
      <h2 class="card-title">{{ title }}</h2>
      <span class="badge-muted">{{ students.length }} record(s)</span>
    </div>

    <div v-if="loading" class="empty-state">Loading student records...</div>

    <div v-else-if="students.length === 0" class="empty-state">
      {{ emptyMessage }}
    </div>

    <div v-else class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
            <th>Phone</th>
            <th>ZIP Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student._id || student.studentId">
            <td class="font-medium">{{ student.name }}</td>
            <td><code>{{ student.studentId }}</code></td>
            <td>{{ student.phone }}</td>
            <td>{{ student.zip }}</td>
            <td>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="confirmDelete(student)"
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