import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { api } from '../services/api';

export const useEnrollmentStore = defineStore('enrollments', () => {
  const selectedCourseId = ref('');
  const selectedCourse = ref(null);
  const rosterStudents = ref([]);
  const loading = ref(false);
  const error = ref('');
  const successMessage = ref('');

  const rosterCount = computed(() => rosterStudents.value.length);

  function clearFeedback() {
    error.value = '';
    successMessage.value = '';
  }

  function clearSelectedCourse() {
    selectedCourseId.value = '';
    selectedCourse.value = null;
    rosterStudents.value = [];
  }

  async function fetchCourseRoster(courseId) {
    if (!courseId) {
      clearSelectedCourse();
      return;
    }
    selectedCourseId.value = courseId;
    loading.value = true;
    error.value = '';
    try {
      const data = await api.getCourseStudents(courseId);
      selectedCourse.value = data.course;
      rosterStudents.value = data.students || [];
    } catch (err) {
      rosterStudents.value = [];
      error.value = err.message || 'Failed to load enrolled students for course.';
    } finally {
      loading.value = false;
    }
  }

  async function refreshActiveRoster() {
    if (selectedCourseId.value) {
      await fetchCourseRoster(selectedCourseId.value);
    }
  }

  async function enrollStudent(studentId, courseId) {
    clearFeedback();
    if (!studentId || !courseId) {
      error.value = 'Please select both a student and a course.';
      return false;
    }
    loading.value = true;
    try {
      const created = await api.enrollStudent({ studentId, courseId });
      successMessage.value = `Enrolled ${created.student.name} (${created.student.studentId}) in ${created.course.courseId} - ${created.course.courseName}.`;

      await fetchCourseRoster(courseId);
      return true;
    } catch (err) {
      error.value = err.message || 'Failed to enroll student.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    selectedCourseId,
    selectedCourse,
    rosterStudents,
    loading,
    error,
    successMessage,
    rosterCount,
    clearFeedback,
    clearSelectedCourse,
    fetchCourseRoster,
    refreshActiveRoster,
    enrollStudent
  };
});