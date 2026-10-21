<script setup>
import { RouterLink } from 'vue-router';
import { useStudentStore } from '../stores/studentStore';
import { useCourseStore } from '../stores/courseStore';

const studentStore = useStudentStore();
const courseStore = useCourseStore();
</script>

<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <div class="brand">
        <span class="brand-title">Student Management System</span>
        <span class="brand-subtitle">CIS 3339 Enterprise App</span>
      </div>
      <nav aria-label="Main Navigation" class="nav-links">
        <RouterLink to="/students" class="nav-link" active-class="active">
          Students
          <span class="badge">{{ studentStore.totalStudents }}</span>
        </RouterLink>
        <RouterLink to="/courses" class="nav-link" active-class="active">
          Courses
          <span class="badge">{{ courseStore.totalCourses }}</span>
        </RouterLink>
        <RouterLink to="/enrollments" class="nav-link" active-class="active">
          Enrollments
        </RouterLink>
      </nav>
    </div>
  </header>
</template>