<script setup>
import { ref, onMounted } from 'vue';
import { useStudentStore } from '../stores/studentStore';
import StatusAlert from '../components/StatusAlert.vue';
import StudentForm from '../components/StudentForm.vue';
import StudentTable from '../components/StudentTable.vue';

const studentStore = useStudentStore();
const searchInput = ref('');

onMounted(() => {
  studentStore.clearFeedback();
  studentStore.fetchStudents();
});

function handleSearch() {
  studentStore.searchStudents(searchInput.value);
}

function handleClearSearch() {
  searchInput.value = '';
  studentStore.resetSearch();
}

async function handleAddStudent(payload, resetForm) {
  const ok = await studentStore.addStudent(payload);
  if (ok) {
    resetForm();
  }
}

async function handleDeleteStudent(student) {
  await studentStore.deleteStudent(student);
}
</script>

<template>
  <div class="view-container">
    <div class="page-header">
      <h1>Student Management</h1>
      <p>Search for existing students, add new student records, or remove students.</p>
    </div>

    <StatusAlert
      :error="studentStore.error"
      :success="studentStore.successMessage"
      @dismiss="studentStore.clearFeedback"
    />

    <section class="card">
      <h2 class="card-title">Search for a Student</h2>
      <form class="search-bar" @submit.prevent="handleSearch">
        <div class="search-input-wrapper">
          <label for="studentName" class="sr-only">Student Name or ID</label>
          <input
            id="studentName"
            v-model="searchInput"
            type="text"
            placeholder="Enter student name (e.g., John) or ID (e.g., 1001)..."
            required
          />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="studentStore.loading">
          Search
        </button>
        <button
          v-if="studentStore.hasSearched"
          type="button"
          class="btn btn-secondary"
          @click="handleClearSearch"
        >
          Show All
        </button>
      </form>
    </section>

    <StudentTable
      v-if="studentStore.hasSearched"
      :title="`Search Results for '${studentStore.lastSearchQuery}'`"
      :students="studentStore.searchResults"
      :loading="studentStore.loading"
      empty-message="No matching students found."
      @delete-student="handleDeleteStudent"
    />

    <StudentForm
      :loading="studentStore.loading"
      @submit-student="handleAddStudent"
    />

    <StudentTable
      title="All Registered Students"
      :students="studentStore.students"
      :loading="studentStore.loading"
      empty-message="No students in the database yet. Add a student above to get started."
      @delete-student="handleDeleteStudent"
    />
  </div>
</template>