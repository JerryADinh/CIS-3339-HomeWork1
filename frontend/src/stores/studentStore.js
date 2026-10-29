import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { api } from '../services/api';
import { useEnrollmentStore } from './enrollmentStore';

export const useStudentStore = defineStore('students', () => {
  const students = ref([]);
  const searchResults = ref([]);
  const hasSearched = ref(false);
  const lastSearchQuery = ref('');
  const loading = ref(false);
  const error = ref('');
  const successMessage = ref('');

  const totalStudents = computed(() => students.value.length);

  function clearFeedback() {
    error.value = '';
    successMessage.value = '';
  }

  async function fetchStudents() {
    loading.value = true;
    error.value = '';
    try {
      students.value = await api.getStudents();
    } catch (err) {
      error.value = err.message || 'Unable to load students.';
    } finally {
      loading.value = false;
    }
  }

  async function searchStudents(query) {
    clearFeedback();
    const trimmed = String(query || '').trim();
    if (!trimmed) {
      error.value = 'Please enter a student name or ID to search.';
      return;
    }

    loading.value = true;
    lastSearchQuery.value = trimmed;
    hasSearched.value = true;

    try {
      const results = await api.getStudents(trimmed);
      searchResults.value = results;
      if (results.length === 0) {
        error.value = `No student found matching "${trimmed}".`;
      }
    } catch (err) {
      searchResults.value = [];
      error.value = err.message || 'Error searching for students.';
    } finally {
      loading.value = false;
    }
  }

  function resetSearch() {
    hasSearched.value = false;
    lastSearchQuery.value = '';
    searchResults.value = [];
    clearFeedback();
  }

  async function addStudent(payload) {
    clearFeedback();
    loading.value = true;
    try {
      const created = await api.addStudent(payload);
      await fetchStudents();
      if (hasSearched.value && lastSearchQuery.value) {
        searchResults.value = await api.getStudents(lastSearchQuery.value);
      }
      successMessage.value = `Student "${created.name}" (ID: ${created.studentId}) added successfully.`;
      return true;
    } catch (err) {
      error.value = err.message || 'Failed to add student.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteStudent(student) {
    clearFeedback();
    loading.value = true;
    try {
      const id = student._id || student.studentId;
      const result = await api.deleteStudent(id);
      students.value = students.value.filter(
        (s) => s._id !== student._id && s.studentId !== student.studentId
      );
      searchResults.value = searchResults.value.filter(
        (s) => s._id !== student._id && s.studentId !== student.studentId
      );
      successMessage.value = result.message || 'Student deleted successfully.';

      const enrollmentStore = useEnrollmentStore();
      await enrollmentStore.refreshActiveRoster();
    } catch (err) {
      error.value = err.message || 'Failed to delete student.';
    } finally {
      loading.value = false;
    }
  }

  return {
    students,
    searchResults,
    hasSearched,
    lastSearchQuery,
    loading,
    error,
    successMessage,
    totalStudents,
    clearFeedback,
    fetchStudents,
    searchStudents,
    resetSearch,
    addStudent,
    deleteStudent
  };
});