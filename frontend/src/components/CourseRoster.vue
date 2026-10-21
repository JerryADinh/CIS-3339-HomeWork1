<script setup>
defineProps({
  courses: {
    type: Array,
    required: true
  },
  selectedCourseId: {
    type: String,
    default: ''
  },
  selectedCourse: {
    type: Object,
    default: null
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

function onCourseChange(event) {
  emit('select-course', event.target.value);
}
</script>

<template>
  <section class="card">
    <div class="card-header">
      <h2 class="card-title">Course Roster — Enrolled Students</h2>
      <span v-if="selectedCourse" class="badge-muted">
        {{ rosterStudents.length }} enrolled
      </span>
    </div>

    <div class="form-group roster-selector">
      <label for="rosterCourseSelect">Select a Course to View Roster</label>
      <select
        id="rosterCourseSelect"
        :value="selectedCourseId"
        @change="onCourseChange"
      >
        <option value="">-- Select a Course --</option>
        <option
          v-for="course in courses"
          :key="course._id"
          :value="course._id"
        >
          {{ course.courseId }} — {{ course.courseName }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="empty-state">Loading course roster...</div>

    <div v-else-if="!selectedCourseId" class="empty-state">
      Select a course above to view all students currently enrolled in it.
    </div>

    <div v-else-if="rosterStudents.length === 0" class="empty-state">
      No students are currently enrolled in
      <strong>{{ selectedCourse?.courseId }} ({{ selectedCourse?.courseName }})</strong>.
    </div>

    <div v-else class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Student ID</th>
            <th>Phone</th>
            <th>ZIP Code</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in rosterStudents" :key="student._id || student.studentId">
            <td class="font-medium">{{ student.name }}</td>
            <td><code>{{ student.studentId }}</code></td>
            <td>{{ student.phone }}</td>
            <td>{{ student.zip }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>