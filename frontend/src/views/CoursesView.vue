<script setup>
import { onMounted } from 'vue';
import { useCourseStore } from '../stores/courseStore';
import StatusAlert from '../components/StatusAlert.vue';
import CourseForm from '../components/CourseForm.vue';
import CourseList from '../components/CourseList.vue';

const courseStore = useCourseStore();

onMounted(() => {
  courseStore.clearFeedback();
  courseStore.fetchCourses();
});

async function handleAddCourse(payload, resetForm) {
  const ok = await courseStore.addCourse(payload);
  if (ok) {
    resetForm();
  }
}

async function handleDeleteCourse(course) {
  await courseStore.deleteCourse(course);
}
</script>

<template>
  <div class="view-container">
    <div class="page-header">
      <h1>Course Management</h1>
      <p>Create new courses, view available courses, or delete existing courses.</p>
    </div>

    <StatusAlert
      :error="courseStore.error"
      :success="courseStore.successMessage"
      @dismiss="courseStore.clearFeedback"
    />

    <CourseForm
      :loading="courseStore.loading"
      @submit-course="handleAddCourse"
    />

    <CourseList
      :courses="courseStore.courses"
      :loading="courseStore.loading"
      @delete-course="handleDeleteCourse"
    />
  </div>
</template>