import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { api } from '../services/api';
import { useEnrollmentStore } from './enrollmentStore';

export const useCourseStore = defineStore('courses', () => {
  const courses = ref([]);
  const loading = ref(false);
  const error = ref('');
  const successMessage = ref('');

  const totalCourses = computed(() => courses.value.length);

  function clearFeedback() {
    error.value = '';
    successMessage.value = '';
  }

  async function fetchCourses() {
    loading.value = true;
    error.value = '';
    try {
      courses.value = await api.getCourses();
    } catch (err) {
      error.value = err.message || 'Unable to load courses.';
    } finally {
      loading.value = false;
    }
  }

  async function addCourse(payload) {
    clearFeedback();
    loading.value = true;
    try {
      const created = await api.addCourse(payload);
      await fetchCourses();
      successMessage.value = `Course "${created.courseId}: ${created.courseName}" added successfully.`;
      return true;
    } catch (err) {
      error.value = err.message || 'Failed to add course.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCourse(course) {
    clearFeedback();
    loading.value = true;
    try {
      const id = course._id || course.courseId;
      const result = await api.deleteCourse(id);
      courses.value = courses.value.filter(
        (c) => c._id !== course._id && c.courseId !== course.courseId
      );
      successMessage.value = result.message || 'Course deleted successfully.';

      const enrollmentStore = useEnrollmentStore();
      if (
        enrollmentStore.selectedCourseId === course._id ||
        enrollmentStore.selectedCourseId === course.courseId
      ) {
        enrollmentStore.clearSelectedCourse();
      } else {
        await enrollmentStore.refreshActiveRoster();
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete course.';
    } finally {
      loading.value = false;
    }
  }

  return {
    courses,
    loading,
    error,
    successMessage,
    totalCourses,
    clearFeedback,
    fetchCourses,
    addCourse,
    deleteCourse
  };
});