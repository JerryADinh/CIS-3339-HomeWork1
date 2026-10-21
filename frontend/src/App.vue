<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import AppNavbar from './components/AppNavbar.vue';
import { useStudentStore } from './stores/studentStore';
import { useCourseStore } from './stores/courseStore';

const studentStore = useStudentStore();
const courseStore = useCourseStore();

onMounted(() => {
  studentStore.fetchStudents();
  courseStore.fetchCourses();
});
</script>

<template>
  <div class="app-shell">
    <AppNavbar />
    <main class="container main-content">
      <RouterView />
    </main>
  </div>
</template>